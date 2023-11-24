package pt.up.fe.sdle2023.db.partition;

import java.util.Iterator;
import java.util.TreeSet;
import java.util.UUID;

public class PartitionIterator implements Iterator<Node> {

    private final Iterator<Node> parentIterator;
    private final long replicationFactor;

    private final TreeSet<UUID> seenPhysicalIds = new TreeSet<>(UUID::compareTo);
    private Node currentNode = null;

    public PartitionIterator(Iterator<Node> parentIterator, long replicationFactor) {
        this.parentIterator = parentIterator;
        this.replicationFactor = replicationFactor;
    }

    private Node findNextPhysicalNode() {
        if (seenPhysicalIds.size() >= replicationFactor) {
            return null;
        }

        while (parentIterator.hasNext()) {
            var node = parentIterator.next();
            if (!seenPhysicalIds.contains(node.getPhysicalId())) {
                seenPhysicalIds.add(node.getPhysicalId());
                return node;
            }
        }

        return null;
    }

    @Override
    public Node next() {
        if (currentNode != null) {
            var node = currentNode;
            currentNode = null;
            return node;
        }

        return findNextPhysicalNode();
    }

    @Override
    public boolean hasNext() {
        if (currentNode != null) {
            return true;
        }

        currentNode = findNextPhysicalNode();
        return currentNode != null;
    }
}
