package pt.up.fe.sdle2023.db.versioning;

import pt.up.fe.sdle2023.db.identification.StorageNodeID;

import java.util.HashMap;
import java.util.Map;

public class VectorClock {

    private final Map<StorageNodeID, Long> clock = new HashMap<>();

    public VectorClock() {}

    public VectorClock(Map<StorageNodeID, Long> clock) {
        this.clock.putAll(clock);
    }

    public boolean isAncestor(VectorClock other) {
        // "If the counters on the first object's clock are less-than-or-equal to all the nodes in the second clock,
        // then the first is an ancestor of the second [...]"

        for (var entry : this.clock.entrySet()) {
            var storageNodeId = entry.getKey();
            var counter = entry.getValue();

            if (counter > other.getCounter(storageNodeId)) {
                return false;
            }
        }

        return true;
    }

    public long getCounter(StorageNodeID node) {
        return this.clock.getOrDefault(node, 0L);
    }

    public VectorClock setCounter(StorageNodeID node, long counter) {
        var newClock = new VectorClock(this.clock);
        newClock.clock.put(node, counter);

        return newClock;
    }

    public VectorClock incrementCounter(StorageNodeID node) {
        return this.setCounter(node, this.getCounter(node) + 1);
    }
}
