package pt.up.fe.sdle2023.db;

import io.grpc.ServerBuilder;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.rocksdb.RocksDBException;
import org.w3c.dom.Node;
import pt.up.fe.sdle2023.db.cluster.OperationCoordinator;
import pt.up.fe.sdle2023.db.cluster.PhysicalNode;
import pt.up.fe.sdle2023.db.cluster.PhysicalNodeRegistry;
import pt.up.fe.sdle2023.db.cluster.PreferenceListManager;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.config.data.NodeConfig;
import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.repository.HintedHandoffsRepository;
import pt.up.fe.sdle2023.db.repository.RepositoryOperationFailedException;
import pt.up.fe.sdle2023.db.repository.StoredDataRepository;
import pt.up.fe.sdle2023.db.service.DirectQueryService;
import pt.up.fe.sdle2023.db.service.HintedHandoffsService;
import pt.up.fe.sdle2023.db.service.QueryService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

public class Server {

    private static final Logger logger = Logger.getLogger(Server.class.getName());

    private final Config config;
    private final NodeConfig nodeConfig;

    private StoredDataRepository storedDataRepository;
    private HintedHandoffsRepository hintedHandoffsRepository;

    private PhysicalNodeRegistry physicalNodeRegistry;
    private PreferenceListManager preferenceListManager;
    private PhysicalNode currentNode;

    private int serverPort;

    public Server(Config config, String instanceName) {
        this.config = config;
        this.nodeConfig = config.getCluster().stream()
                .filter(node -> node.getName().equals(instanceName))
                .findFirst()
                .orElseThrow();
    }

    private void initializeRepositories() throws IOException, RepositoryOperationFailedException {
        var dataPath = Paths.get("repositories");
        Files.createDirectories(dataPath);

        this.storedDataRepository = new StoredDataRepository(dataPath);
        this.hintedHandoffsRepository = new HintedHandoffsRepository(dataPath);
    }

    private void initializeNodes() {
        this.physicalNodeRegistry = new PhysicalNodeRegistry();
        for (var nodeConfig : config.getCluster()) {
            var physicalNode = new PhysicalNode(nodeConfig);
            this.physicalNodeRegistry.addPhysicalNode(physicalNode);

            if (nodeConfig.equals(this.nodeConfig)) {
                this.currentNode = physicalNode;
            }
        }

        this.preferenceListManager = new PreferenceListManager(physicalNodeRegistry, config.getPreferenceListSize());
    }

    private void closeRepositories() {
        this.storedDataRepository.close();
        this.hintedHandoffsRepository.close();
    }

    public void run() throws InterruptedException {
        try {
            this.initializeRepositories();
            this.initializeNodes();

            var hintedHandoffsService = new HintedHandoffsService(physicalNodeRegistry, hintedHandoffsRepository);
            GlobalExecutor.getExecutor().execute(hintedHandoffsService);

            var directQueryService = new DirectQueryService(storedDataRepository, hintedHandoffsRepository);

            var operationCoordinator = new OperationCoordinator(config, directQueryService, currentNode);
            var queryService = new QueryService(preferenceListManager, operationCoordinator);

            var port = this.nodeConfig.getPort();
            var grpcServer = ServerBuilder.forPort(port)
                    .addService(queryService)
                    .addService(directQueryService)
                    .addService(ProtoReflectionService.newInstance())
                    .executor(GlobalExecutor.getExecutor())
                    .build();

            grpcServer.start();
            logger.config("Server listening on 0.0.0.0:%d".formatted(port));

            grpcServer.awaitTermination();

        } catch (RepositoryOperationFailedException | IOException e) {
            logger.severe("Failed to start server");
            logger.throwing(Server.class.getName(), "start", e);
        } finally {
            this.closeRepositories();
        }
    }
}
