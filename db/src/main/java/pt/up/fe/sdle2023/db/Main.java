package pt.up.fe.sdle2023.db;


import org.rocksdb.*;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.config.data.Node;
import pt.up.fe.sdle2023.db.config.ConfigReader;
import pt.up.fe.sdle2023.db.config.ConfigWriter;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws RocksDBException, IOException {

        RocksDB.loadLibrary();

        var options = new Options();
        options.setCreateIfMissing(true);

        var configFile = System.getenv().getOrDefault("CONFIG_PATH", "config.yaml");
        var configPath = Path.of(configFile);

        if (args.length > 0) {
            if (args[0].equals("start")) {
                if (args.length > 1) {
                    var instanceName = args[1];

                    var reader = new ConfigReader();
                    var config = reader.read(configPath);

                    var server = new Server(config, instanceName);
                    server.start();

                    return;
                }
            } else if (args[0].equals("init-config")) {
                var config = new Config();
                config.setCluster(List.of(new Node("example-node", "127.0.0.1", 6000)));

                var writer = new ConfigWriter();
                writer.write(configPath, config);
            } else {
                System.out.printf("Unknown command: %s%n", args[0]);
            }
        }

        printUsage();
        System.exit(1);
    }

    public static void printUsage() {
        System.out.println("Usage: java -jar db.jar [command] [args]");
        System.out.println("Commands:");
        System.out.println("  start [instance-name] - start an instance with the given name");
        System.out.println("  init-config - initialize the config file");
    }
}