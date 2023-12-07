package pt.up.fe.sdle2023.db.config;

import org.yaml.snakeyaml.Yaml;
import pt.up.fe.sdle2023.db.config.data.Config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ConfigReader {

    private final Yaml yaml = new Yaml();

    public Config read(Path path) throws IOException {
        var inputStream = Files.newInputStream(path);
        return yaml.loadAs(inputStream, Config.class);
    }
}
