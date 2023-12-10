package pt.up.fe.sdle2023.db.services;

import com.google.protobuf.ByteString;
import com.google.protobuf.Empty;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import org.rocksdb.RocksDBException;
import pt.up.fe.sdle2023.db.controller.QueryServiceGrpc;
import pt.up.fe.sdle2023.db.controller.ServiceProtos;
import pt.up.fe.sdle2023.db.model.Token;
import pt.up.fe.sdle2023.db.model.storage.StoredData;
import pt.up.fe.sdle2023.db.model.storage.StoredDataVersion;
import pt.up.fe.sdle2023.db.model.storage.VectorClock;
import pt.up.fe.sdle2023.db.repository.DataRepository;

import java.util.List;

public class QueryService extends QueryServiceGrpc.QueryServiceImplBase {

    private final DataRepository dataRepository;

    public QueryService(DataRepository dataRepository) {
        this.dataRepository = dataRepository;
    }

    @Override
    public void getEntry(ServiceProtos.QueryGetRequest request, StreamObserver<ServiceProtos.QueryGetResponse> responseObserver) {
        var key = request.getKey();
        if (key.isEmpty()) {
            responseObserver.onError(
                    Status.INVALID_ARGUMENT
                    .withDescription("Key cannot be empty")
                    .asRuntimeException());

            return;
        }

        var token = Token.digestString(key);

        try {
            var value = dataRepository.get(key);

            if (value == null) {
                responseObserver.onError(
                        Status.NOT_FOUND
                        .withDescription("Key not found")
                        .asRuntimeException());

                return;
            }


            var response = ServiceProtos.QueryGetResponse.newBuilder()
                    .setContext(ByteString.EMPTY)
                    .addAllValues(
                            value.getVersions()
                                    .stream()
                                    .map(StoredDataVersion::getData)
                                    .map(ByteString::copyFrom)
                                    .toList()
                    )
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (RocksDBException e) {
            responseObserver.onError(
                    Status.INTERNAL
                    .withDescription("Error while retrieving value")
                    .asRuntimeException());
        }
    }

    @Override
    public void putEntry(ServiceProtos.QueryPutRequest request, StreamObserver<Empty> responseObserver) {
        var key = request.getKey();

        if (key.isEmpty()) {
            responseObserver.onError(
                    Status.INVALID_ARGUMENT
                            .withDescription("Key cannot be empty")
                            .asRuntimeException());

            return;
        }

        try {
            var newStoredData = new StoredData(List.of(new StoredDataVersion(new VectorClock(), request.getValue().toByteArray())));
            dataRepository.put(key, newStoredData);

            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();

        } catch (RocksDBException e) {
            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription("Error while inserting value")
                            .asRuntimeException());
        }
    }
}
