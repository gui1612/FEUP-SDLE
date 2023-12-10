package pt.up.fe.sdle2023.db.partitioning.hashing;

import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.partitioning.PartitionNode;
import pt.up.fe.sdle2023.db.partitioning.PartitionNodeFactory;

import java.nio.ByteBuffer;

/**
 * A node factory that generates nodes with consistent hashing.
 * <br>
 * This factory will generate nodes with a consistent hash, meaning that the
 * same physical node will always be assigned the same virtual nodes.
 *
 * @implNote The hashing method used is MD5.
 */
public class ConsistentHashingPartitionNodeFactory implements PartitionNodeFactory {
    private final Token storageNodeId;
    private long counter = 0;

    public ConsistentHashingPartitionNodeFactory(Token storageNodeId) {
        this.storageNodeId = storageNodeId;
    }

    @Override
    public PartitionNode createNewNode() {
        ByteBuffer nodeId = ByteBuffer.allocate(3 * Long.BYTES);
        nodeId.putLong(storageNodeId.mostSignificantBits());
        nodeId.putLong(storageNodeId.leastSignificantBits());
        nodeId.putLong(counter);

        var id = Token.digestBytes(nodeId.array());
        counter++;

        return new PartitionNode(storageNodeId, id);
    }
}
