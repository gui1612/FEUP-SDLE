package pt.up.fe.sdle2023.db.config.data;

import java.util.List;

public class Config {

    private List<NodeConfig> cluster;
    private int replicationFactor;
    private int preferenceListSize;
    private int readConsistency;
    private int writeConsistency;

    public List<NodeConfig> getCluster() {
        return cluster;
    }

    public void setCluster(List<NodeConfig> cluster) {
        this.cluster = cluster;
    }

    public int getReplicationFactor() {
        return replicationFactor;
    }

    public void setReplicationFactor(int replicationFactor) {
        this.replicationFactor = replicationFactor;
    }

    public int getPreferenceListSize() {
        return preferenceListSize;
    }

    public void setPreferenceListSize(int preferenceListSize) {
        this.preferenceListSize = preferenceListSize;
    }

    public int getReadConsistency() {
        return readConsistency;
    }

    public void setReadConsistency(int readConsistency) {
        this.readConsistency = readConsistency;
    }

    public int getWriteConsistency() {
        return writeConsistency;
    }

    public void setWriteConsistency(int writeConsistency) {
        this.writeConsistency = writeConsistency;
    }

    @Override
    public String toString() {
        return "Config{" +
                "cluster=" + cluster +
                '}';
    }
}
