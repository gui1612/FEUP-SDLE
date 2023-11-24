package pt.up.fe.sdle2023.db.storage;

import org.rocksdb.Options;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;

public class DbService implements AutoCloseable {

    private RocksDB rocksDB;

    public DbService(String dbPath) throws RocksDBException {
        RocksDB.loadLibrary();
        Options options = new Options();
        options.setCreateIfMissing(true);
        this.rocksDB = RocksDB.open(options, dbPath);
    }

    public void put(byte[] key, byte[] value) throws RocksDBException {
        rocksDB.put(key, value);
    }

    public void get(byte[] key, byte[] value) throws RocksDBException {
        rocksDB.get(key, value);
    }

    @Override
    public void close() throws RocksDBException {
        rocksDB.close();
    }
}
