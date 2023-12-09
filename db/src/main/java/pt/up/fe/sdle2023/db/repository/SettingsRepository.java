package pt.up.fe.sdle2023.db.repository;

import com.google.protobuf.InvalidProtocolBufferException;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.proto.DatabaseProtos;

import java.nio.file.Path;

public class SettingsRepository {

    private static final byte[] SETTINGS_KEY = new byte[]{0x00};

    private final RocksDB db;

    public SettingsRepository(Path dataPath) throws RocksDBException {
        RocksDB.loadLibrary();
        this.db = RocksDB.open(dataPath.resolve("settings").toString());
    }

    public DatabaseProtos.Settings get() throws RocksDBException {
        var settingsBytes = db.get(SETTINGS_KEY);
        try {
            return settingsBytes != null
                    ? DatabaseProtos.Settings.parseFrom(settingsBytes)
                    : null;
        } catch (InvalidProtocolBufferException ignored) {
            return null;
        }
    }

    public DatabaseProtos.Settings put(DatabaseProtos.Settings settings) throws RocksDBException {
        db.put(SETTINGS_KEY, settings.toByteArray());
        return settings;
    }

    public void delete() throws RocksDBException {
        db.delete(SETTINGS_KEY);
    }
}
