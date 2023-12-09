package pt.up.fe.sdle2023.db.repository;

import com.google.protobuf.InvalidProtocolBufferException;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.proto.DatabaseProtos;

import java.nio.file.Path;

public class DataRepository {

    private final RocksDB db;

    public DataRepository(Path dataPath) throws RocksDBException {
        RocksDB.loadLibrary();
        this.db = RocksDB.open(dataPath.resolve("data").toString());
    }

    public byte[] get(String key) throws RocksDBException {
        return db.get(key.getBytes());
    }

    public byte[] put(String key, byte[] value) throws RocksDBException {
        db.put(key.getBytes(), value);
        return value;
    }

    public void delete(String key) throws RocksDBException {
        db.delete(key.getBytes());
    }
}
