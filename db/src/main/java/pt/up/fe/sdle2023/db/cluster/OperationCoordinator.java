package pt.up.fe.sdle2023.db.cluster;

import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.GlobalExecutor;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.service.DirectQueryService;
import pt.up.fe.sdle2023.db.service.DirectQueryServiceGrpc;
import pt.up.fe.sdle2023.db.service.DirectQueryServiceProtos;
import pt.up.fe.sdle2023.db.service.ServiceProtos;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class OperationCoordinator {

    private final Config config;
    private final DirectQueryService directQueryService;
    private final PhysicalNode coordinatorNode;

    public OperationCoordinator(Config config, DirectQueryService directQueryService, PhysicalNode coordinatorNode) {
        this.config = config;
        this.directQueryService = directQueryService;
        this.coordinatorNode = coordinatorNode;
    }

    public PhysicalNode getCoordinatorNode() {
        return coordinatorNode;
    }

    public boolean canCoordinate(List<PhysicalNode> preferenceList) {
        return preferenceList.contains(coordinatorNode);
    }

    public Optional<List<ModelProtos.StoredData>> coordinateGet(List<PhysicalNode> preferenceList, ServiceProtos.GetRequest request) throws InterruptedException {
        var numberOfNodesNeeded = config.getReadConsistency();
        var replicationFactor = config.getReplicationFactor();

        final var latch = new CountDownLatch(numberOfNodesNeeded);
        final var values = new ArrayList<ModelProtos.StoredData>();

        Function<PhysicalNode, StreamObserver<ModelProtos.StoredData>> createCumulativeResponseObserver = node ->
            createResponseObserver(
                node,
                latch::countDown,
                (response) -> {
                    synchronized (values) {
                        values.add(response);
                    }
                });

        var preferenceListForCoordinator = Stream.concat(Stream.of(coordinatorNode),
            preferenceList.stream().filter(node -> !node.equals(coordinatorNode))).toList();

        var nodes = preferenceListForCoordinator.stream()
            .filter(node -> node.getHealthManager().isHealthy())
            .limit(replicationFactor)
            .toList();

        var sloppyQuorumSize = nodes.size();
        if (sloppyQuorumSize < numberOfNodesNeeded) {
            return Optional.empty();
        }

        for (var node : nodes) {
            var responseObserver = createCumulativeResponseObserver.apply(node);

            sendGetRequestToNode(
                node,
                request,
                responseObserver
            );
        }

        latch.await();

        synchronized (values) {
            if (values.size() < numberOfNodesNeeded) {
                return Optional.empty();
            }

            return Optional.of(new ArrayList<>(values));
        }
    }

    public Optional<List<Empty>> coordinatePut(List<PhysicalNode> preferenceList, ServiceProtos.PutRequest request) throws InterruptedException {
        var numberOfNodesNeeded = config.getWriteConsistency();
        var replicationFactor = config.getReplicationFactor();

        final var latch = new CountDownLatch(numberOfNodesNeeded);
        final var values = new ArrayList<Empty>();

        Function<PhysicalNode, StreamObserver<Empty>> createCumulativeResponseObserver = node -> createResponseObserver(
            node,
            latch::countDown,
            (response) -> {
                synchronized (values) {
                    values.add(response);
                }
            });

        var preferenceListForCoordinator = Stream.concat(Stream.of(coordinatorNode),
                preferenceList.stream().filter(node -> !node.equals(coordinatorNode))).toList();

        var replicators = preferenceListForCoordinator.stream()
            .limit(replicationFactor)
            .collect(Collectors.groupingBy(node -> node.getHealthManager().isHealthy()));

        var healthyReplicators = replicators.get(true);

        var unhealthyReplicators = replicators.get(false);
        var hintedHandoffNodes = preferenceListForCoordinator.stream()
            .skip(replicationFactor)
            .filter(node -> node.getHealthManager().isHealthy())
            .limit(unhealthyReplicators.size())
            .toList();

        var sloppyQuorumSize = healthyReplicators.size() + hintedHandoffNodes.size();
        if (sloppyQuorumSize < numberOfNodesNeeded) {
            return Optional.empty();
        }

        for (var healthyReplicator : healthyReplicators) {
            var responseObserver = createCumulativeResponseObserver.apply(healthyReplicator);

            sendPutRequestToNode(
                healthyReplicator,
                DirectQueryServiceProtos.PutRequestWithHint.newBuilder()
                    .setRequest(request)
                    .build(),
                responseObserver
            );
        }

        for (var i = 0; i < hintedHandoffNodes.size(); i++) {
            var hintedHandoffNode = hintedHandoffNodes.get(i);
            var unhealthyReplicator = unhealthyReplicators.get(i);

            var responseObserver = createCumulativeResponseObserver.apply(hintedHandoffNode);

            sendPutRequestToNode(
                hintedHandoffNode,
                DirectQueryServiceProtos.PutRequestWithHint.newBuilder()
                    .setRequest(request)
                    .setIntendedRecipient(unhealthyReplicator.getName())
                    .build(),
                responseObserver
            );
        }

        latch.await();

        synchronized (values) {
            if (values.size() < numberOfNodesNeeded) {
                return Optional.empty();
            }

            return Optional.of(new ArrayList<>(values));
        }
    }

    private <Res> StreamObserver<Res> createResponseObserver(PhysicalNode node, Runnable onEnded, Consumer<Res> onNext) {
        return new StreamObserver<>() {
            @Override
            public void onNext(Res res) {
                onNext.accept(res);
            }

            @Override
            public void onError(Throwable throwable) {
                node.getHealthManager().markUnhealthy();
                onEnded.run();
            }

            @Override
            public void onCompleted() {
                onEnded.run();
            }
        };
    }

    private void sendGetRequestToNode(PhysicalNode node, ServiceProtos.GetRequest request, StreamObserver<ModelProtos.StoredData> responseObserver) {
        if (node.equals(coordinatorNode)) {
            GlobalExecutor.getExecutor().execute(() -> directQueryService.directGetEntry(request, responseObserver));
        } else {
            var stub = DirectQueryServiceGrpc.newStub(node.getChannel())
                .withDeadlineAfter(1, TimeUnit.SECONDS);

            stub.directGetEntry(request, responseObserver);
        }
    }

    private void sendPutRequestToNode(PhysicalNode node, DirectQueryServiceProtos.PutRequestWithHint request, StreamObserver<Empty> responseObserver) {
        if (node.equals(coordinatorNode)) {
            GlobalExecutor.getExecutor().execute(() -> directQueryService.directPutEntry(request, responseObserver));
        } else {
            var stub = DirectQueryServiceGrpc.newStub(node.getChannel())
                .withDeadlineAfter(1, TimeUnit.SECONDS);

            stub.directPutEntry(request, responseObserver);
        }
    }
}
