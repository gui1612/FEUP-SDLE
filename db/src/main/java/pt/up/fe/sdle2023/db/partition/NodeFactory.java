package pt.up.fe.sdle2023.db.partition;

import java.nio.ByteBuffer;
import java.util.UUID;

public class NodeFactory {

    private final UUID physicalId;
    private long counter = 0;

    public NodeFactory(UUID physicalId) {
        this.physicalId = physicalId;
    }

    public Node createNewNode() {
        ByteBuffer nodeId = ByteBuffer.allocate(3 * Long.BYTES);
        nodeId.putLong(physicalId.getMostSignificantBits());
        nodeId.putLong(physicalId.getLeastSignificantBits());
        nodeId.putLong(counter);

        UUID id = UUID.nameUUIDFromBytes(nodeId.array());
        counter++;

        return new Node(physicalId, id);
    }
}
