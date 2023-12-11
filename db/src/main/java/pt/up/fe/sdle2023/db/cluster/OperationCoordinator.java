package pt.up.fe.sdle2023.db.cluster;

import com.google.protobuf.Empty;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.GlobalExecutor;
import pt.up.fe.sdle2023.db.config.data.Config;
import pt.up.fe.sdle2023.db.service.DirectQueryService;
import pt.up.fe.sdle2023.db.service.DirectQueryServiceGrpc;
import pt.up.fe.sdle2023.db.service.ServiceProtos;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

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

    public Optional<List<ServiceProtos.GetResponse>> coordinateGet(List<PhysicalNode> preferenceList, ServiceProtos.GetRequest request) throws InterruptedException {
        final var latch = new CountDownLatch(preferenceList.size());
        final List<ServiceProtos.GetResponse> values = new ArrayList<>();

        for (var node : preferenceList) {
            var responseObserver = createResponseObserver(
                node,
                latch::countDown,
                (ServiceProtos.GetResponse response) -> {
                   synchronized (values) {
                       values.add(response);
                   }
                });

            if (node.equals(coordinatorNode)) {
                GlobalExecutor.getExecutor().execute(() -> {
                    directQueryService.directGetEntry(
                        request,
                        responseObserver
                    );
                });
            } else {
                var stub = DirectQueryServiceGrpc.newStub(node.getChannel())
                    .withDeadlineAfter(1, TimeUnit.SECONDS);

                stub.directGetEntry(
                    request,
                    responseObserver
                );
            }
        }

        latch.await();

        if (values.size() < config.getReadConsistency()) {
            return Optional.empty();
        }

        return Optional.of(values);
    }

    public Optional<List<Empty>> coordinatePut(List<PhysicalNode> preferenceList, ServiceProtos.PutRequest request) throws InterruptedException {
        final var latch = new CountDownLatch(preferenceList.size());
        final List<Empty> values = new ArrayList<>();

        for (var node : preferenceList) {
            var responseObserver = createResponseObserver(
                node,
                latch::countDown,
                (Empty response) -> {
                    synchronized (values) {
                        values.add(response);
                    }
                });

            if (node.equals(coordinatorNode)) {
                GlobalExecutor.getExecutor().execute(() -> {
                    directQueryService.directPutEntry(
                        request,
                        responseObserver
                    );
                });
            } else {
                var stub = DirectQueryServiceGrpc.newStub(node.getChannel())
                    .withDeadlineAfter(1, TimeUnit.SECONDS);

                stub.directPutEntry(
                    request,
                    responseObserver
                );
            }
        }

        latch.await();

        if (values.size() < config.getWriteConsistency()) {
            return Optional.empty();
        }

        return Optional.of(values);
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
}
