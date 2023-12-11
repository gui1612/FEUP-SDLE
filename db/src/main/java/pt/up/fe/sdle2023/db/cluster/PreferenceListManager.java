package pt.up.fe.sdle2023.db.cluster;

import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.model.Token;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PreferenceListManager {
    private final SortedMap<Token, VirtualNode> virtualNodes = new TreeMap<>();
    private final Config config;

    public PreferenceListManager(Config config) {
        this.config = config;
    }

    public List<PhysicalNode> getPreferenceList(Token key) {
        Set<PhysicalNode> addedPhysicalNodes = new HashSet<>();

        return Stream.concat(
                        virtualNodes.tailMap(key).sequencedValues().stream(), // greater than or equal to key
                        virtualNodes.headMap(key).sequencedValues().stream()) // less than key
                .map(VirtualNode::getPhysicalNode)
                .filter(addedPhysicalNodes::add)
                .limit(config.getPreferenceListSize())
                .toList();
    }

    public void addNode(PhysicalNode node) {
        virtualNodes.putAll(
                node.getVirtualNodes()
                        .stream()
                        .collect(Collectors.toMap(VirtualNode::getToken, Function.identity()))
        );
    }

    public void removeNode(PhysicalNode node) {
        for (var virtualNode : node.getVirtualNodes())
            virtualNodes.remove(virtualNode.getToken());
    }
}
