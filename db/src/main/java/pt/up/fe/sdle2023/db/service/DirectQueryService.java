package pt.up.fe.sdle2023.db.service;

import com.google.protobuf.Empty;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.model.storage.HintedHandoffs;
import pt.up.fe.sdle2023.db.model.storage.StoredData;
import pt.up.fe.sdle2023.db.model.storage.StoredDataVersion;
import pt.up.fe.sdle2023.db.model.storage.VectorClock;
import pt.up.fe.sdle2023.db.repository.HintedHandoffsRepository;
import pt.up.fe.sdle2023.db.repository.RepositoryOperationFailedException;
import pt.up.fe.sdle2023.db.repository.StoredDataRepository;

import java.util.List;
import java.util.stream.Stream;

public class DirectQueryService extends DirectQueryServiceGrpc.DirectQueryServiceImplBase {

    private final StoredData.Serializer storedDataSerializer = new StoredData.Serializer();
    private final VectorClock.Serializer vectorClockSerializer = new VectorClock.Serializer();

    private final StoredDataRepository storedDataRepository;
    private final HintedHandoffsRepository hintedHandoffsRepository;

    public DirectQueryService(StoredDataRepository storedDataRepository, HintedHandoffsRepository hintedHandoffsRepository) {
        this.storedDataRepository = storedDataRepository;
        this.hintedHandoffsRepository = hintedHandoffsRepository;
    }

    @Override
    public void directGetEntry(ServiceProtos.GetRequest request, StreamObserver<ModelProtos.StoredData> responseObserver) {
        var key = request.getKey();

        try {
            var storedData = storedDataRepository.get(key)
                .map(StoredData::compact)
                .orElseGet(() -> new StoredData(List.of()));

            responseObserver.onNext(storedDataSerializer.toProto(storedData));
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
    public void directPutEntry(DirectQueryServiceProtos.PutRequestWithHint request, StreamObserver<Empty> responseObserver) {
        var originalRequest = request.getRequest();

        if (request.hasIntendedRecipient()) {
            var physicalNodeName = request.getIntendedRecipient();

            try {
                handoffPutTo(physicalNodeName, originalRequest);

                responseObserver.onNext(Empty.getDefaultInstance());
                responseObserver.onCompleted();
            } catch (RepositoryOperationFailedException e) {
                responseObserver.onError(
                    Status.INTERNAL
                        .withDescription("Failed to write handoff")
                        .asRuntimeException()
                );
            }

            return;
        }

        var key = originalRequest.getKey();

        try {
            var storedData = storedDataRepository.get(key)
                .orElseGet(() -> new StoredData(List.of()));

            var incomingVectorClock = vectorClockSerializer.fromProto(originalRequest.getContext().getVectorClock());

            var newDataVersions = Stream.concat(
                Stream.of(new StoredDataVersion(incomingVectorClock, originalRequest.getValue())),
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

    private void handoffPutTo(String physicalNodeName, ServiceProtos.PutRequest request) throws RepositoryOperationFailedException {
        var currentHandoffs = hintedHandoffsRepository.get(physicalNodeName)
            .orElseGet(() -> new HintedHandoffs(List.of()));

        var newHandoffsStream = Stream.concat(
            currentHandoffs.getHandoffs().stream(),
            Stream.of(request)
        );

        var newHandoffs = new HintedHandoffs(newHandoffsStream.toList());
        hintedHandoffsRepository.put(physicalNodeName, newHandoffs);
    }
}
