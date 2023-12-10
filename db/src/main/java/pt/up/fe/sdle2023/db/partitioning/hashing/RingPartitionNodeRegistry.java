package pt.up.fe.sdle2023.db.partitioning.hashing;

import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.partitioning.PartitionNodeRegistry;
import pt.up.fe.sdle2023.db.partitioning.PartitionNode;

import java.util.*;
import java.util.stream.Stream;

public class RingPartitionNodeRegistry implements PartitionNodeRegistry {

    private final TreeSet<PartitionNode> partitionNodes = new TreeSet<>(PartitionNode::compareTo);

    @Override
    public void addNode(PartitionNode partitionNode) {
        partitionNodes.add(partitionNode);
    }

    @Override
    public void removeNode(PartitionNode partitionNode) {
        partitionNodes.remove(partitionNode);
    }


    @Override
    public Iterator<PartitionNode> findPreferentialNodesForToken(Token key) {
        var marker = new PartitionNode(null, key);

        var baseIterator = Stream.concat(
                        partitionNodes.tailSet(marker).stream(), // greater than or equal to marker
                        partitionNodes.headSet(marker).stream()) // less than marker
                .iterator();

        return new Iterator<>() {
            final HashSet<Token> seenStorageIds = new HashSet<>();
            PartitionNode nextPartitionNode = null;

            @Override
            public boolean hasNext() {
                if (nextPartitionNode != null)
                    return true;

                while (baseIterator.hasNext()) {
                    var node = baseIterator.next();
                    if (!seenStorageIds.contains(node.storageToken())) {
                        seenStorageIds.add(node.storageToken());
                        nextPartitionNode = node;
                        return true;
                    }
                }

                return false;
            }

            @Override
            public PartitionNode next() {
                if (!hasNext())
                    throw new NoSuchElementException();

                var node = nextPartitionNode;
                nextPartitionNode = null;
                return node;
            }
        };
    }
}
