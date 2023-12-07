package pt.up.fe.sdle2023.db.config;

import org.yaml.snakeyaml.Yaml;
import pt.up.fe.sdle2023.db.config.data.Config;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class ConfigWriter {

    private final Yaml yaml = new Yaml();

    public void write(Path path, Config config) throws IOException {
        var outputStream = Files.newOutputStream(path);
        var writer = new PrintWriter(outputStream);

        yaml.dump(config, writer);
    }
}
