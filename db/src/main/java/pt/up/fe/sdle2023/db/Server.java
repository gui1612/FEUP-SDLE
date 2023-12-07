package pt.up.fe.sdle2023.db;

import pt.up.fe.sdle2023.db.config.data.Node;

public class Server {

    private final Node nodeConfig;

    public Server(Node nodeConfig) {
        this.nodeConfig = nodeConfig;
    }

    public void start() {
        System.out.println("Starting server on " + nodeConfig.getAddress());
    }
}
