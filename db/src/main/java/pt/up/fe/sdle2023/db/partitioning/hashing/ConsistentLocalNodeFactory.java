package pt.up.fe.sdle2023.db.partitioning.hashing;

import pt.up.fe.sdle2023.db.identification.StorageNodeID;
import pt.up.fe.sdle2023.db.identification.VirtualNodeID;
import pt.up.fe.sdle2023.db.partitioning.Node;
import pt.up.fe.sdle2023.db.partitioning.NodeFactory;

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
public class ConsistentLocalNodeFactory implements NodeFactory {
    private final StorageNodeID storageNodeId;
    private long counter = 0;

    public ConsistentLocalNodeFactory(StorageNodeID storageNodeId) {
        this.storageNodeId = storageNodeId;
    }

    @Override
    public Node createNewNode() {
        ByteBuffer nodeId = ByteBuffer.allocate(3 * Long.BYTES);
        nodeId.putLong(storageNodeId.asUUID().getMostSignificantBits());
        nodeId.putLong(storageNodeId.asUUID().getLeastSignificantBits());
        nodeId.putLong(counter);

        var id = new VirtualNodeID(UUID.nameUUIDFromBytes(nodeId.array()));
        counter++;

        return new Node(storageNodeId, id, true);
    }
}
