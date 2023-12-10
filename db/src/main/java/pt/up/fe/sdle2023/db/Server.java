package pt.up.fe.sdle2023.db;

import io.grpc.ServerBuilder;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.partitioning.PartitionNodeRegistry;
import pt.up.fe.sdle2023.db.partitioning.hashing.RingPartitionNodeRegistry;
import pt.up.fe.sdle2023.db.repository.DataRepository;
import pt.up.fe.sdle2023.db.services.QueryService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

public class Server {

    private static final Logger logger = Logger.getLogger(Server.class.getName());
    private final int port;

    private DataRepository dataRepository = null;

    private  PartitionNodeRegistry partitionNodeRegistry = null;

    public Server(int port) {
        this.port = port;
    }

    private void initializeRepositories() throws IOException, RocksDBException {
        var dataPath = Paths.get("repositories");
        Files.createDirectories(dataPath);

        this.dataRepository = new DataRepository(dataPath);
    }

    private void closeRepositories() {
        this.dataRepository.close();
    }

    private void initializeNodeRegistry(Config config) {
        this.partitionNodeRegistry = new RingPartitionNodeRegistry();

    }

    public void run() throws InterruptedException {
        try {
            this.initializeRepositories();

            var grpcServer = ServerBuilder.forPort(port)
                    .addService(new QueryService(dataRepository))
                    .addService(ProtoReflectionService.newInstance())
                    .executor(Executors.newVirtualThreadPerTaskExecutor())
                    .build();

            grpcServer.start();
            logger.config("Server listening on 0.0.0.0:%d".formatted(port));

            grpcServer.awaitTermination();

        } catch (RocksDBException | IOException e) {
            logger.severe("Failed to start server");
            logger.throwing(Server.class.getName(), "start", e);
        } finally {
            this.closeRepositories();
        }
    }
}
