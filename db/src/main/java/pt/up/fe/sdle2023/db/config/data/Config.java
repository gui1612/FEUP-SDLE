package pt.up.fe.sdle2023.db.config.data;

import java.util.List;

public class Config {

    private List<NodeConfig> cluster;

    public List<NodeConfig> getCluster() {
        return cluster;
    }

    public void setCluster(List<NodeConfig> cluster) {
        this.cluster = cluster;
    }

    @Override
    public String toString() {
        return "Config{" +
                "cluster=" + cluster +
                '}';
    }
}
