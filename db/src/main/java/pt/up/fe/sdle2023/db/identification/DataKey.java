package pt.up.fe.sdle2023.db.identification;

import java.util.UUID;

public record DataKey(UUID asUUID) implements Comparable<DataKey> {

    @Override
    public int compareTo(DataKey other) {
        return this.asUUID.compareTo(other.asUUID);
    }
}
