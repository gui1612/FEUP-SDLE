package pt.up.fe.sdle2023.db.cluster;

import java.sql.Array;
import java.util.*;

public class PhysicalNodeRegistry {

    private final List<PhysicalNode> physicalNodes = new ArrayList<>();

    public void addPhysicalNode(PhysicalNode physicalNode) {
        physicalNodes.add(physicalNode);
    }

    public Collection<PhysicalNode> getPhysicalNodes() {
        return Collections.unmodifiableList(physicalNodes);
    }

    public PhysicalNode findNodeByName(String name) {
        return physicalNodes.stream()
            .filter(node -> node.getName().equals(name))
            .findAny()
            .orElseThrow();
    }
}
