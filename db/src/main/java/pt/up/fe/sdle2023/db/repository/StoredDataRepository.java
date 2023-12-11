package pt.up.fe.sdle2023.db.repository;

import com.google.protobuf.InvalidProtocolBufferException;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.model.storage.StoredData;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Optional;
import java.util.logging.Logger;

public class StoredDataRepository implements AutoCloseable {
    private static final Logger logger = Logger.getLogger(StoredDataRepository.class.getName());

    private final StoredData.Serializer serializer = new StoredData.Serializer();
    private final RocksDB db;


    public StoredDataRepository(Path dataPath) throws RepositoryOperationFailedException {
        RocksDB.loadLibrary();
        var databasePath = dataPath.resolve("database");

        try {
            this.db = RocksDB.open(databasePath.toString());
        } catch (RocksDBException e) {
            logger.throwing(StoredDataRepository.class.getName(), "open", e);
            throw new RepositoryOperationFailedException("Could not open database", e);
        }
    }

    public Optional<StoredData> get(String key) throws RepositoryOperationFailedException {
        var keyBytes = key.getBytes(StandardCharsets.UTF_8);

        try {
            var valueBytes = db.get(keyBytes);
            if (valueBytes == null) {
                return Optional.empty();
            }

            return Optional.of(serializer.fromBytes(valueBytes));
        } catch (InvalidProtocolBufferException e) {
            logger.throwing(StoredDataRepository.class.getName(), "get", e);
            return Optional.empty();
        } catch (RocksDBException e) {
            logger.throwing(StoredDataRepository.class.getName(), "get", e);
            throw new RepositoryOperationFailedException("Could not get database entry", e);
        }
    }

    public void put(String key, StoredData value) throws RepositoryOperationFailedException {
        var keyBytes = key.getBytes(StandardCharsets.UTF_8);
        var valueBytes = serializer.toBytes(value);

        try {
            db.put(keyBytes, valueBytes);
        } catch (RocksDBException e) {
            logger.throwing(StoredDataRepository.class.getName(), "put", e);
            throw new RepositoryOperationFailedException("Could not put database entry", e);
        }
    }

    public void delete(String key) throws RepositoryOperationFailedException {
        var keyBytes = key.getBytes(StandardCharsets.UTF_8);

        try {
            db.delete(keyBytes);
        } catch (RocksDBException e) {
            logger.throwing(StoredDataRepository.class.getName(), "delete", e);
            throw new RepositoryOperationFailedException("Could not delete database entry", e);
        }
    }

    @Override
    public void close() {
        this.db.close();
    }
}
