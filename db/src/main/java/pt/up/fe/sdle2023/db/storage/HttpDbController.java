package pt.up.fe.sdle2023.db.storage;

import com.sun.net.httpserver.HttpServer;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.storage.DbService;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class HttpDbController implements AutoCloseable {

    private final DbService db;
    private final Executor executor;
    private final HttpServer http;

    public HttpDbController(DbService db) throws IOException {
        this.db = db;
        this.executor = Executors.newSingleThreadExecutor();
        this.http = HttpServer.create();

        this.registerRoutes();
    }

    public void bindAndStart(InetSocketAddress addr) throws IOException {
        http.bind(addr, 0);
        http.start();
    }

    @Override
    public void close() throws RocksDBException {
        http.stop(10);
        this.db.close();
    }

    private void registerRoutes() {
        this.http.createContext("/", new MyHandler(this.db));
    }
}
