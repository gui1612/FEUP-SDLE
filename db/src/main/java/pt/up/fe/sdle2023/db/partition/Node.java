package pt.up.fe.sdle2023.db.partition;

import java.util.UUID;

public record Node(UUID physicalId, UUID id, boolean isLocal) implements Comparable<Node> {

    public boolean isSibling(Node other) {
        return this.physicalId.equals(other.physicalId);
    }

    @Override
    public int compareTo(Node other) {
        return this.id.compareTo(other.id);
    }
}
