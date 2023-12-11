package pt.up.fe.sdle2023.db.service;

import com.google.protobuf.Empty;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.model.storage.StoredData;
import pt.up.fe.sdle2023.db.model.storage.StoredDataVersion;
import pt.up.fe.sdle2023.db.model.storage.VectorClock;
import pt.up.fe.sdle2023.db.repository.RepositoryOperationFailedException;
import pt.up.fe.sdle2023.db.repository.StoredDataRepository;

import java.util.List;
import java.util.stream.Stream;

public class DirectQueryService extends DirectQueryServiceGrpc.DirectQueryServiceImplBase {

    private final VectorClock.Serializer vectorClockSerializer = new VectorClock.Serializer();
    private final StoredDataRepository storedDataRepository;

    public DirectQueryService(StoredDataRepository storedDataRepository) {
        this.storedDataRepository = storedDataRepository;
    }

    @Override
    public void directGetEntry(ServiceProtos.GetRequest request, StreamObserver<ServiceProtos.GetResponse> responseObserver) {
        var key = request.getKey();

        try {
            var storedData = storedDataRepository.get(key)
                .orElseGet(() -> new StoredData(List.of()));

            // Create a new vector clock that merges all the versions
            var versions = storedData.getVersions();
            var newClock = versions.stream()
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

            versions.stream()
                .map(StoredDataVersion::getData)
                .forEach(responseBuilder::addValues);

            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();

        } catch (RepositoryOperationFailedException e) {
            responseObserver.onError(
                Status.INTERNAL
                    .withDescription("Could not get entry")
                    .asRuntimeException()
            );
        }
    }

    @Override
    public void directPutEntry(ServiceProtos.PutRequest request, StreamObserver<Empty> responseObserver) {
        var key = request.getKey();

        try {
            var storedData = storedDataRepository.get(key)
                .orElseGet(() -> new StoredData(List.of()));

            var incomingVectorClock = vectorClockSerializer.fromProto(request.getContext().getVectorClock());

            var newDataVersions = Stream.concat(
                Stream.of(new StoredDataVersion(incomingVectorClock, request.getValue())),
                storedData.getVersions()
                    .stream()
                    .filter(version -> !version.getVectorClock().isAncestor(incomingVectorClock)));

            storedDataRepository.put(key, new StoredData(newDataVersions.toList()));

            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();

        } catch (RepositoryOperationFailedException e) {
            responseObserver.onError(
                Status.INTERNAL
                    .withDescription("Could not get entry")
                    .asRuntimeException()
            );
        }
    }
}
