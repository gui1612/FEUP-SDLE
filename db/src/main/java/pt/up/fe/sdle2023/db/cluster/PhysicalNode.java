package pt.up.fe.sdle2023.db.cluster;

import io.grpc.*;
import pt.up.fe.sdle2023.db.GlobalExecutor;
import pt.up.fe.sdle2023.db.config.data.NodeConfig;
import pt.up.fe.sdle2023.db.health.HealthManager;
import pt.up.fe.sdle2023.db.model.Token;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class PhysicalNode {

    private final ManagedChannel channel;
    private final HealthManager healthManager = new HealthManager(1000);

    private final Token token;
    private final List<VirtualNode> virtualNodes = new ArrayList<>();

    public PhysicalNode(NodeConfig nodeConfig) {
        this.channel = createCommunicationChannel(nodeConfig.getHost(), nodeConfig.getPort());
        this.token = Token.digestString(nodeConfig.getName());

        this.createVirtualNodes(nodeConfig.getCapacity());
    }

    private ManagedChannel createCommunicationChannel(String host, int port) {
        return ManagedChannelBuilder.forAddress(host, port)
            .executor(GlobalExecutor.getExecutor())
            .disableRetry()
            .build();
    }

    private void createVirtualNodes(int capacity) {
        for (int i = 0; i < capacity; i++) {
            ByteBuffer virtualTokenBuffer = ByteBuffer.allocate(3 * Long.BYTES);

            virtualTokenBuffer.putLong(token.mostSignificantBits());
            virtualTokenBuffer.putLong(token.leastSignificantBits());
            virtualTokenBuffer.putLong(i);

            var virtualToken = Token.digestBytes(virtualTokenBuffer.array());
            virtualNodes.add(new VirtualNode(this, virtualToken));
        }
    }

    public ManagedChannel getChannel() {
        return channel;
    }

    public HealthManager getHealthManager() {
        return healthManager;
    }

    public Token getToken() {
        return token;
    }

    public List<VirtualNode> getVirtualNodes() {
        return virtualNodes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhysicalNode that = (PhysicalNode) o;
        return Objects.equals(token, that.token);
    }

    @Override
    public int hashCode() {
        return Objects.hash(token);
    }
}
