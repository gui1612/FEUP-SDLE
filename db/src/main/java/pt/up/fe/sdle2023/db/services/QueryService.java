package pt.up.fe.sdle2023.db.services;

import com.google.protobuf.ByteString;
import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.identification.Token;
import pt.up.fe.sdle2023.db.proto.QueryServiceGrpc;
import pt.up.fe.sdle2023.db.proto.ServiceProtos;

public class QueryService extends QueryServiceGrpc.QueryServiceImplBase {

    @Override
    public void getEntry(ServiceProtos.QueryGetRequest request, StreamObserver<ServiceProtos.QueryGetResponse> responseObserver) {
        var token = Token.digestString(request.getKey());

        ServiceProtos.QueryGetResponse response = ServiceProtos.QueryGetResponse.newBuilder()
                .addValues(ByteString.copyFromUtf8("value"))
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();

    }

    @Override
    public void putEntry(ServiceProtos.QueryPutRequest request, StreamObserver<Empty> responseObserver) {

    }
}
