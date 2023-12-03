package pt.up.fe.sdle2023.db.partitioning;

import pt.up.fe.sdle2023.db.identification.DataKey;

import java.util.Iterator;
import java.util.UUID;

public interface NodeManager {
    void addNode(Node node);

    void removeNode(Node node);

    Iterator<Node> findPreferentialNodesForKey(DataKey key);
}
