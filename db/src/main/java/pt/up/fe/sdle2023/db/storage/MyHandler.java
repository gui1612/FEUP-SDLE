package pt.up.fe.sdle2023.db.storage;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.rocksdb.RocksDBException;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MyHandler implements HttpHandler {
    final DbService db;

    public MyHandler(DbService db) {
        this.db = db;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Handle the HTTP request, interact with the database, and send a response.
        // Example: If it's a GET request, retrieve data from the database and send it as a response.
        // If it's a POST request, parse the incoming data, and store it in the database.

        String response = "Hello World!";
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
            if (pathSegments.length > 1) {
                String key = pathSegments[1];

                byte[] responseBytes = new byte[0];
                try {
                    db.get(key.getBytes(), responseBytes);
                } catch (RocksDBException e) {
                    throw new RuntimeException(e);
                }
                response = new String(responseBytes, StandardCharsets.UTF_8);
            }
        }

        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes(StandardCharsets.UTF_8));
        os.close();
    }
}
