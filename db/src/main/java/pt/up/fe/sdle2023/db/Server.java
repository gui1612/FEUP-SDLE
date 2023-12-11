package pt.up.fe.sdle2023.db;

import io.grpc.ServerBuilder;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.rocksdb.RocksDBException;
import org.w3c.dom.Node;
import pt.up.fe.sdle2023.db.cluster.OperationCoordinator;
import pt.up.fe.sdle2023.db.cluster.PhysicalNode;
import pt.up.fe.sdle2023.db.cluster.PreferenceListManager;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.config.data.NodeConfig;
import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.repository.RepositoryOperationFailedException;
import pt.up.fe.sdle2023.db.repository.StoredDataRepository;
import pt.up.fe.sdle2023.db.service.DirectQueryService;
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
    }

    private void initializeNodes() {
        this.preferenceListManager = new PreferenceListManager(config);

        for (var nodeConfig : config.getCluster()) {
            var physicalNode = new PhysicalNode(nodeConfig);
            this.preferenceListManager.addNode(physicalNode);

            if (this.nodeConfig.equals(nodeConfig)) {
                this.currentNode = physicalNode;
                break;
            }
        }
    }

    private void closeRepositories() {
        this.storedDataRepository.close();
    }

    public void run() throws InterruptedException {
        try {
            this.initializeRepositories();
            this.initializeNodes();

            var directQueryService = new DirectQueryService(storedDataRepository);

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
