package pt.up.fe.sdle2023.db.partition.hashing;

import pt.up.fe.sdle2023.db.partition.Node;
import pt.up.fe.sdle2023.db.partition.NodeFactory;

import java.nio.ByteBuffer;
import java.util.UUID;

/**
 * A node factory that generates nodes with consistent hashing.
 * <br>
 * This factory will generate nodes with a consistent hash, meaning that the
 * same physical node will always be assigned the same virtual nodes.
 *
 * @implNote The hashing method used is MD5.
 */
public class ConsistentNodeFactory implements NodeFactory {
    private final UUID physicalId;
    private long counter = 0;

    public ConsistentNodeFactory(UUID physicalId) {
        this.physicalId = physicalId;
    }

    @Override
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
