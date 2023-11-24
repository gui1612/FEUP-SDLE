package pt.up.fe.sdle2023.db;


import com.google.common.base.Charsets;
import org.rocksdb.*;

import java.nio.ByteBuffer;

public class Main {
    public static void main(String[] args) throws RocksDBException {

        RocksDB.loadLibrary();

        var options = new Options();
        options.setCreateIfMissing(true);

    //    var db = RocksDB.open(options, "db.rocksdb");
    //    db.put("hello".getBytes(Charsets.UTF_8), "world".getBytes());

    }
}