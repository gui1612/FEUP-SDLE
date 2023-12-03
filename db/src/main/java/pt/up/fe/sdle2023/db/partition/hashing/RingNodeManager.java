package pt.up.fe.sdle2023.db.partition.hashing;

import pt.up.fe.sdle2023.db.partition.Node;
import pt.up.fe.sdle2023.db.partition.NodeManager;

import java.util.Iterator;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.UUID;
import java.util.stream.Collectors;
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
    public Iterator<Node> findNodesForKey(UUID key) {
        var marker = new Node(null, key, false);

        var baseIterator = Stream.concat(
                        nodes.tailSet(marker).stream(), // greater than or equal to marker
                        nodes.headSet(marker).stream()) // less than marker
                .limit((long) replicationFactor * replicationFactor) // worst case scenario - all nodes are siblings
                .iterator();

        return new Iterator<>() {
            final TreeSet<UUID> seenPhysicalIds = new TreeSet<>();

            @Override
            public boolean hasNext() {
                return seenPhysicalIds.size() < replicationFactor && baseIterator.hasNext();
            }

            @Override
            public Node next() {
                while (hasNext()) {
                    var node = baseIterator.next();
                    if (!seenPhysicalIds.contains(node.physicalId())) {
                        seenPhysicalIds.add(node.physicalId());
                        return node;
                    }
                }

                return null;
            }
        };
    }
}
