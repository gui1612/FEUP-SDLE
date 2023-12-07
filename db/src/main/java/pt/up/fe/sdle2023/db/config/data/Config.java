package pt.up.fe.sdle2023.db.config.data;

import java.util.List;

public class Config {

    private List<Node> cluster;

    public List<Node> getCluster() {
        return cluster;
    }

    public void setCluster(List<Node> cluster) {
        this.cluster = cluster;
    }

    @Override
    public String toString() {
        return "Config{" +
                "cluster=" + cluster +
                '}';
    }
}
