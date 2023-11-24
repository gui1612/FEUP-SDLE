package pt.up.fe.sdle2023.db.partition;

import java.util.Comparator;
import java.util.Iterator;
import java.util.TreeSet;
import java.util.UUID;

public class PartitionManager {

    private final TreeSet<Node> nodes = new TreeSet<>(Node::compareTo);
    private final int replicationFactor;

    public PartitionManager(int replicationFactor) {
        this.replicationFactor = replicationFactor;
    }

    public void addNode(Node node) {
        nodes.add(node);
    }

    public void removeNode(Node node) {
        nodes.remove(node);
    }

    public Iterator<Node> findNodesForKey(UUID id) {
        final var iterator = nodes.iterator();

        return new Iterator<>() {

            private Node nextNode = null;

            @Override
            public boolean hasNext() {
                return false;
            }

            @Override
            public Node next() {
                return null;
            }
        }
    }
}
