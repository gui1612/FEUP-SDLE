package pt.up.fe.sdle2023.db.model.storage;

import com.google.protobuf.Parser;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.model.ProtoSerializer;
import pt.up.fe.sdle2023.db.model.Token;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class VectorClock implements Comparable<VectorClock> {

    private final Map<Token, Long> clock = new HashMap<>();

    public VectorClock() {}

    public VectorClock(Map<Token, Long> clock) {
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

    public VectorClock merge(VectorClock other) {
        // To merge two vector clocks, take the maximum of each individual element in the two clocks.
        // This will create a new clock that represents both clocks.

        var newClock = new VectorClock(this.clock);

        for (var entry : other.clock.entrySet()) {
            var storageNodeId = entry.getKey();
            var counter = entry.getValue();

            newClock.clock.put(storageNodeId, Math.max(newClock.getCounter(storageNodeId), counter));
        }

        return newClock;
    }


    public long getCounter(Token node) {
        return this.clock.getOrDefault(node, 0L);
    }

    public VectorClock setCounter(Token node, long counter) {
        var newClock = new VectorClock(this.clock);
        newClock.clock.put(node, counter);

        return newClock;
    }

    @Override
    public int compareTo(VectorClock other) {
        if (this.isAncestor(other)) {
            return -1;
        } else if (other.isAncestor(this)) {
            return 1;
        }

        return 0;
    }

    public VectorClock incrementCounter(Token node) {
        return this.setCounter(node, this.getCounter(node) + 1);
    }

    public static class Serializer implements ProtoSerializer<VectorClock, ModelProtos.VectorClock> {

        private static final Token.Serializer tokenSerializer = new Token.Serializer();

        @Override
        public ModelProtos.VectorClock toProto(VectorClock model) {
            return ModelProtos.VectorClock.newBuilder()
                    .addAllEntries(
                            model.clock.entrySet()
                                    .stream()
                                    .map(entry -> ModelProtos.VectorClock.Entry.newBuilder()
                                            .setNodeToken(tokenSerializer.toProto(entry.getKey()))
                                            .setCounter(entry.getValue())
                                            .build())
                                    .toList())
                    .build();
        }

        @Override
        public VectorClock fromProto(ModelProtos.VectorClock proto) {
            return new VectorClock(
                    proto.getEntriesList()
                            .stream()
                            .collect(
                                    HashMap::new,
                                    (map, entry) -> map.put(
                                            tokenSerializer.fromProto(entry.getNodeToken()),
                                            entry.getCounter()),
                                    HashMap::putAll));
        }

        @Override
        public Parser<ModelProtos.VectorClock> createProtoParser() {
            return ModelProtos.VectorClock.parser();
        }
    }
}
