package pt.up.fe.sdle2023.db.partition;

import java.util.Iterator;

public class PartitionIterator implements Iterator<Node> {

    private final Iterator<Node> parentIterator;
    private final long replicationFactor;

    private Node currentNode = null;

    public PartitionIterator(Iterator<Node> parentIterator, long replicationFactor) {
        this.parentIterator = parentIterator;
        this.replicationFactor = replicationFactor;
    }

    @Override
    public Node next() {
        while (parentIterator.hasNext()) {
            
        }
        return null;
    }

    @Override
    public boolean hasNext() {
        return false;
    }
}
