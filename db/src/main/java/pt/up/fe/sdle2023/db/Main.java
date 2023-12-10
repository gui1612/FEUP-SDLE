package pt.up.fe.sdle2023.db;


import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.config.data.NodeConfig;
import pt.up.fe.sdle2023.db.config.ConfigReader;
import pt.up.fe.sdle2023.db.config.ConfigWriter;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.LogManager;
import java.util.logging.Logger;

public class Main {

    private static final Logger logger = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        initializeLoggingConfiguration();

        var configFile = System.getenv().getOrDefault("CONFIG_PATH", "config.yaml");
        var configPath = Path.of(configFile);

        if (args.length > 0) {
            if (args[0].equals("start")) {
                if (args.length > 1) {
                    var instanceName = args[1];
                    runServer(configPath, instanceName);
                    return;
                }
            } else if (args[0].equals("init-config")) {
                initializeConfig(configPath);
                return;
            } else {
                System.out.printf("Unknown command: %s%n", args[0]);
            }
        }

        printUsage();
        System.exit(1);
    }

    private static void initializeLoggingConfiguration() {
        try {
            LogManager.getLogManager().readConfiguration(Main.class.getResourceAsStream("/conf/logging.properties"));
        } catch (IOException ignored) {
           System.err.println("Could not load logging configuration file");
        }
    }

    private static void runServer(Path configPath, String instanceName) {
        try {
            var reader = new ConfigReader();
            var config = reader.read(configPath);

            var server = new Server(6000);
            server.run();
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Could not read config file", e);
        } catch (InterruptedException ignored) {}
    }

    private static void initializeConfig(Path configPath) {
        try {
            var config = new Config();
            config.setCluster(List.of(new NodeConfig("example-node", "127.0.0.1", 6000)));

            var writer = new ConfigWriter();
            writer.write(configPath, config);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Could not write config file", e);
        }
    }

    private static void printUsage() {
        System.out.println("Usage: java -jar db.jar [command] [args]");
        System.out.println("Commands:");
        System.out.println("  start [instance-name] - start an instance with the given name");
        System.out.println("  init-config - initialize the config file");
    }
}