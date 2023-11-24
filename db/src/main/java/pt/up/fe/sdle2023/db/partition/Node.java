package pt.up.fe.sdle2023.db.partition;

import java.nio.ByteBuffer;
import java.util.UUID;

public class Node implements Comparable<Node> {


    private final UUID physicalId;
    private final UUID id;

    public Node(UUID physicalId, UUID id) {
        this.physicalId = physicalId;
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public boolean isSibling(Node other) {
        return this.physicalId.equals(other.physicalId);
    }

    @Override
    public int compareTo(Node other) {
        return this.id.compareTo(other.id);
    }
}
