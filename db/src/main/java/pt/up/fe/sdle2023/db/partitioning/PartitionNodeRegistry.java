package pt.up.fe.sdle2023.db.partitioning;

import pt.up.fe.sdle2023.db.model.Token;

import java.util.Iterator;

public interface PartitionNodeRegistry {
    void addNode(PartitionNode partitionNode);

    void removeNode(PartitionNode partitionNode);

    Iterator<PartitionNode> findPreferentialNodesForToken(Token key);
}
