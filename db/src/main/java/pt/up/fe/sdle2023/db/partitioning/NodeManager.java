package pt.up.fe.sdle2023.db.partitioning;

import pt.up.fe.sdle2023.db.identification.Token;

import java.util.Iterator;

public interface NodeManager {
    void addNode(Node node);

    void removeNode(Node node);

    Iterator<Node> findPreferentialNodesForKey(Token key);
}
