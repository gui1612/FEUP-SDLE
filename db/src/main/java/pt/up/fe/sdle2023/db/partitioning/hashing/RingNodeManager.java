package pt.up.fe.sdle2023.db.partitioning.hashing;

import pt.up.fe.sdle2023.db.identification.Token;
import pt.up.fe.sdle2023.db.identification.StorageNodeID;
import pt.up.fe.sdle2023.db.identification.VirtualNodeID;
import pt.up.fe.sdle2023.db.partitioning.Node;
import pt.up.fe.sdle2023.db.partitioning.NodeManager;

import java.util.HashSet;
import java.util.Iterator;
import java.util.TreeSet;
import java.util.stream.Stream;

public class RingNodeManager implements NodeManager {

    private final TreeSet<Node> nodes = new TreeSet<>(Node::compareTo);
    private final int replicationFactor;

    public RingNodeManager(int replicationFactor) {
        this.replicationFactor = replicationFactor;
    }

    @Override
    public void addNode(Node node) {
        nodes.add(node);
    }

    @Override
    public void removeNode(Node node) {
        nodes.remove(node);
    }

    @Override
    public Iterator<Node> findPreferentialNodesForKey(Token key) {
        var marker = new Node(null, new VirtualNodeID(key), false);

        var baseIterator = Stream.concat(
                        nodes.tailSet(marker).stream(), // greater than or equal to marker
                        nodes.headSet(marker).stream()) // less than marker
                .limit((long) replicationFactor * replicationFactor) // worst case scenario - all nodes are siblings
                .iterator();

        return new Iterator<>() {
            final HashSet<StorageNodeID> seenStorageIds = new HashSet<>();

            @Override
            public boolean hasNext() {
                return seenStorageIds.size() < replicationFactor && baseIterator.hasNext();
            }

            @Override
            public Node next() {
                while (hasNext()) {
                    var node = baseIterator.next();
                    if (!seenStorageIds.contains(node.storageNodeId())) {
                        seenStorageIds.add(node.storageNodeId());
                        return node;
                    }
                }

                return null;
            }
        };
    }
}
