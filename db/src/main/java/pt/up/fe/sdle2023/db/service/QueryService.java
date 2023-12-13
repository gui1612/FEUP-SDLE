package pt.up.fe.sdle2023.db.service;

import com.google.protobuf.Empty;
import io.grpc.*;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.GlobalExecutor;
import pt.up.fe.sdle2023.db.cluster.OperationCoordinator;
import pt.up.fe.sdle2023.db.cluster.PhysicalNode;
import pt.up.fe.sdle2023.db.cluster.PreferenceListManager;
import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.model.storage.StoredData;
import pt.up.fe.sdle2023.db.model.storage.StoredDataVersion;
import pt.up.fe.sdle2023.db.model.storage.VectorClock;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Vector;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class QueryService extends QueryServiceGrpc.QueryServiceImplBase {

    private static final Status NO_COORDINATOR = Status.UNAVAILABLE.withDescription("No coordinator available");

    private final StoredDataVersion.Serializer storedDataVersionSerializer = new StoredDataVersion.Serializer();
    private final VectorClock.Serializer vectorClockSerializer = new VectorClock.Serializer();

    private final PreferenceListManager preferenceListManager;
    private final OperationCoordinator operationCoordinator;


    public QueryService(PreferenceListManager preferenceListManager, OperationCoordinator operationCoordinator) {
        this.preferenceListManager = preferenceListManager;
        this.operationCoordinator = operationCoordinator;
    }

    private <T> boolean validateKey(String key, StreamObserver<T> responseObserver) {
        if (key.isEmpty()) {
            responseObserver.onError(
                Status.INVALID_ARGUMENT
                    .withDescription("Key cannot be empty")
                    .asRuntimeException());

            return false;
        }

        return true;
    }

    @Override
    public void getEntry(ServiceProtos.GetRequest request, StreamObserver<ServiceProtos.GetResponse> responseObserver) {
        var key = request.getKey();
        if (!validateKey(key, responseObserver)) {
            return;
        }

        var keyToken = Token.digestString(key);
        routeRequest(
            keyToken,
            preferenceList -> {
                // Run as coordinator
                try {
                    var responsesOptional = operationCoordinator.coordinateGet(preferenceList, request);
                    if (responsesOptional.isEmpty()) {
                        responseObserver.onError(
                            Status.ABORTED
                                .withDescription("Could not coordinate get")
                                .asRuntimeException()
                        );
                        return;
                    }

                    var responses = responsesOptional.get();

                    var collectedVersions = responses.stream()
                        .flatMap(response -> response.getVersionsList().stream())
                        .map(storedDataVersionSerializer::fromProto)
                        .toList();

                    var collectedStoredData = new StoredData(collectedVersions).compact();

                    // Create a new vector clock that merges all the versions
                    var newClock = collectedStoredData.getVersions()
                        .stream()
                        .map(StoredDataVersion::getVectorClock)
                        .reduce(
                            new VectorClock(),
                            VectorClock::merge
                        );

                    // Create the context from the new vector clock
                    var context = ServiceProtos.Context.newBuilder()
                        .setVectorClock(vectorClockSerializer.toProto(newClock))
                        .build();

                    // Create the response
                    var responseBuilder = ServiceProtos.GetResponse.newBuilder()
                        .setContext(context);

                    collectedStoredData.getVersions()
                        .stream()
                        .map(StoredDataVersion::getData)
                        .forEach(responseBuilder::addValues);

                    responseObserver.onNext(responseBuilder.build());
                    responseObserver.onCompleted();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            },
            coordinatorNode -> proxyRequestToNode(coordinatorNode, stub -> stub.getEntry(request), responseObserver),
            () -> responseObserver.onError(NO_COORDINATOR.asException())
        );
    }

    @Override
    public void putEntry(ServiceProtos.PutRequest request, StreamObserver<Empty> responseObserver) {
        var key = request.getKey();
        if (!validateKey(key, responseObserver)) {
            return;
        }

        Token keyToken = Token.digestString(key);
        routeRequest(
            keyToken,
            preferenceList -> {
                // Run as coordinator
                try {
                    var requestVectorClock = vectorClockSerializer.fromProto(request.getContext().getVectorClock());
                    requestVectorClock.incrementCounter(operationCoordinator.getCoordinatorNode().getToken());

                    var newRequest = ServiceProtos.PutRequest.newBuilder(request)
                        .setContext(
                            ServiceProtos.Context.newBuilder()
                                .setVectorClock(vectorClockSerializer.toProto(requestVectorClock))
                                .build()
                        )
                        .build();

                    var responsesOptional = operationCoordinator.coordinatePut(preferenceList, request);
                    if (responsesOptional.isEmpty()) {
                        responseObserver.onError(
                            Status.ABORTED
                                .withDescription("Could not coordinate put")
                                .asRuntimeException()
                        );
                        return;
                    }

                    responseObserver.onNext(Empty.getDefaultInstance());
                    responseObserver.onCompleted();
                } catch (InterruptedException e) {
                   throw new RuntimeException(e);
                }
            },
            coordinatorNode -> proxyRequestToNode(coordinatorNode, stub -> stub.putEntry(request), responseObserver),
            () -> responseObserver.onError(NO_COORDINATOR.asException())
        );
    }

    private void routeRequest(Token key, Consumer<List<PhysicalNode>> ifCoordinator, Consumer<PhysicalNode> ifNotCoordinator, Runnable ifNoCoordinator) {
        var preferenceList = preferenceListManager.getPreferenceList(key);

        if (operationCoordinator.canCoordinate(preferenceList)) {
            // Run as coordinator
            ifCoordinator.accept(preferenceList);
            return;
        }

        // Send to coordinator
        var coordinatorNode = preferenceList.stream()
            .filter(node -> node.getHealthManager().isHealthy())
            .findFirst();

        if (coordinatorNode.isEmpty()) {
            ifNoCoordinator.run();
            return;
        }

        ifNotCoordinator.accept(coordinatorNode.get());
    }

    private <Res> void proxyRequestToNode(PhysicalNode node, Function<QueryServiceGrpc.QueryServiceBlockingStub, Res> callRpc, StreamObserver<Res> responseObserver) {
        var stub = QueryServiceGrpc.newBlockingStub(node.getChannel())
            .withDeadlineAfter(5, TimeUnit.SECONDS);

        try {
            var response = callRpc.apply(stub);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (StatusRuntimeException e) {
            node.getHealthManager().markUnhealthy();
            responseObserver.onError(e);
        }
    }
}
