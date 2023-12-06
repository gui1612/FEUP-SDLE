package pt.up.fe.sdle2023.db.config;

import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
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
