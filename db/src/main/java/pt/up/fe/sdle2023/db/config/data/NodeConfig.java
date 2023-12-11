package pt.up.fe.sdle2023.db.config.data;

public class NodeConfig {

    private String name;
    private String host;
    private int port;
    private int capacity;

    public NodeConfig() {}

    public NodeConfig(String name, String host, int port, int capacity) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.capacity = capacity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getCapacity() {
        return capacity;
    }

    @Override
    public String toString() {
        return "Node{" +
                "name='" + name + '\'' +
                ", host='" + host + '\'' +
                ", port='" + port + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}
