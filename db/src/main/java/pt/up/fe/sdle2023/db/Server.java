package pt.up.fe.sdle2023.db;

import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.identification.Token;
import pt.up.fe.sdle2023.db.proto.DatabaseProtos;
import pt.up.fe.sdle2023.db.repository.SettingsRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Server {

    private final Config config;
    private final String instanceName;

    private SettingsRepository settingsRepository;

    public Server(Config config, String instanceName) {
        this.config = config;
        this.instanceName = instanceName;

    }

    private void initiaizeRepositories() throws IOException, RocksDBException {
        var dataPath = Paths.get("repositories");
        Files.createDirectories(dataPath);

        this.settingsRepository = new SettingsRepository(dataPath);
    }

    private DatabaseProtos.Settings createDefaultSettings() {
        var storageToken = Token.randomToken();

        return DatabaseProtos.Settings.newBuilder()
                .setStorageToken(storageToken.toTokenProto())
                .build();
    }
    public void start() throws IOException {
        try {
            this.initiaizeRepositories();

            var nodeConfig = config.getCluster().stream()
                    .filter(node -> node.getName().equals(instanceName))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No node with name %s".formatted(instanceName)));

            var storedSettings = settingsRepository.get();
            if (storedSettings == null) {
                storedSettings = settingsRepository.put(this.createDefaultSettings());
            }

            System.out.printf("Starting server on %s:%d%n", nodeConfig.getHost(), nodeConfig.getPort());

        } catch (RocksDBException e) {
            System.err.println("Failed to initialize server");
            throw new RuntimeException(e);
        }
    }
}
