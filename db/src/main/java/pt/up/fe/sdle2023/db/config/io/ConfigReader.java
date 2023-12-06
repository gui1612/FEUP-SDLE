package pt.up.fe.sdle2023.db.config.io;

import org.yaml.snakeyaml.Yaml;
import pt.up.fe.sdle2023.db.config.Config;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class ConfigReader {

    private final Yaml yaml = new Yaml();

    public Config read(Path path) throws IOException {
        var inputStream = Files.newInputStream(path);
        return yaml.loadAs(inputStream, Config.class);
    }
}
