package pt.up.fe.sdle2023.db.partition;

import java.util.Iterator;
import java.util.TreeSet;
import java.util.UUID;

public interface NodeManager {
    void addNode(Node node);

    void removeNode(Node node);

    Iterator<Node> findNodesForKey(UUID key);
}
