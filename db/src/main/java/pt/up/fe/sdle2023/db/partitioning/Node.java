package pt.up.fe.sdle2023.db.partitioning;

import pt.up.fe.sdle2023.db.identification.StorageNodeID;
import pt.up.fe.sdle2023.db.identification.VirtualNodeID;

public record Node(StorageNodeID storageNodeId, VirtualNodeID id, boolean isLocal) implements Comparable<Node> {

    public boolean isSibling(Node other) {
        return this.storageNodeId.equals(other.storageNodeId);
    }

    @Override
    public int compareTo(Node other) {
        return this.id.compareTo(other.id());
    }
}
