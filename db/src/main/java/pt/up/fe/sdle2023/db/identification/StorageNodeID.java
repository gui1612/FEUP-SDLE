package pt.up.fe.sdle2023.db.identification;

import java.util.UUID;

public record StorageNodeID(UUID asUUID) implements Comparable<StorageNodeID> {

    @Override
    public int compareTo(StorageNodeID other) {
        return this.asUUID.compareTo(other.asUUID);
    }
}