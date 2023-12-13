package pt.up.fe.sdle2023.db.repository;

import com.google.protobuf.InvalidProtocolBufferException;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import org.rocksdb.RocksIterator;
import pt.up.fe.sdle2023.db.model.storage.HintedHandoffs;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.*;
import java.util.logging.Logger;

public class HintedHandoffsRepository implements AutoCloseable {
    private static final Logger logger = Logger.getLogger(HintedHandoffsRepository.class.getName());

    private final HintedHandoffs.Serializer serializer = new HintedHandoffs.Serializer();
    private final RocksDB db;

    public HintedHandoffsRepository(Path dataPath) throws RepositoryOperationFailedException {
        RocksDB.loadLibrary();
        var databasePath = dataPath.resolve("hinted_replicas");

        try {
            this.db = RocksDB.open(databasePath.toString());
        } catch (RocksDBException e) {
            logger.throwing(HintedHandoffsRepository.class.getName(), "open", e);
            throw new RepositoryOperationFailedException("Could not open database", e);
        }
    }

    public Optional<HintedHandoffs> get(String physicalNodeName) throws RepositoryOperationFailedException {
        var keyBytes = physicalNodeName.getBytes(StandardCharsets.UTF_8);

        try {
            var valueBytes = db.get(keyBytes);
            if (valueBytes == null) {
                return Optional.empty();
            }

            return Optional.of(serializer.fromBytes(valueBytes));
        } catch (InvalidProtocolBufferException e) {
            logger.throwing(HintedHandoffsRepository.class.getName(), "get", e);
            return Optional.empty();
        } catch (RocksDBException e) {
            logger.throwing(HintedHandoffsRepository.class.getName(), "get", e);
            throw new RepositoryOperationFailedException("Could not get database entry", e);
        }
    }

    public void put(String physicalNodeName, HintedHandoffs value) throws RepositoryOperationFailedException {
        var keyBytes = physicalNodeName.getBytes(StandardCharsets.UTF_8);
        var valueBytes = serializer.toBytes(value);

        try {
            db.put(keyBytes, valueBytes);
        } catch (RocksDBException e) {
            logger.throwing(HintedHandoffsRepository.class.getName(), "put", e);
            throw new RepositoryOperationFailedException("Could not put database entry", e);
        }
    }

    public void delete(String key) throws RepositoryOperationFailedException {
        var keyBytes = key.getBytes(StandardCharsets.UTF_8);

        try {
            db.delete(keyBytes);
        } catch (RocksDBException e) {
            logger.throwing(HintedHandoffsRepository.class.getName(), "delete", e);
            throw new RepositoryOperationFailedException("Could not delete database entry", e);
        }
    }

    @Override
    public void close() {
        this.db.close();
    }
}
