package pt.up.fe.sdle2023.db.repository;

import com.google.common.base.Charsets;
import com.google.protobuf.InvalidProtocolBufferException;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.model.storage.StoredData;

import java.nio.file.Path;

public class DataRepository implements AutoCloseable {

    private final RocksDB db;
    private final StoredData.Serializer serializer = new StoredData.Serializer();

    public DataRepository(Path dataPath) throws RocksDBException {
        RocksDB.loadLibrary();
        this.db = RocksDB.open(dataPath.resolve("data").toString());
    }

    public StoredData get(String key) throws RocksDBException {
        var keyBytes = key.getBytes(Charsets.UTF_8);

        try {
            var valueBytes = db.get(keyBytes);
            return valueBytes != null
                    ? serializer.fromBytes(valueBytes)
                    : null;
        } catch (InvalidProtocolBufferException ignored) {
            return null;
        }
    }

    public void put(String key, StoredData value) throws RocksDBException {
        var keyBytes = key.getBytes(Charsets.UTF_8);
        var valueBytes = serializer.toBytes(value);

        db.put(keyBytes, valueBytes);
    }

    public void delete(String key) throws RocksDBException {
        var keyBytes = key.getBytes(Charsets.UTF_8);
        db.delete(keyBytes);
    }

    @Override
    public void close() {
        this.db.close();
    }
}
