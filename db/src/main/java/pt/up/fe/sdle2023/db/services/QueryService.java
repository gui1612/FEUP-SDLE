package pt.up.fe.sdle2023.db.services;

import com.google.protobuf.ByteString;
import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import pt.up.fe.sdle2023.db.identification.Token;
import pt.up.fe.sdle2023.db.query.QueryServiceGrpc;
import pt.up.fe.sdle2023.db.query.QueryServiceOuterClass;

import java.util.UUID;

public class QueryService extends QueryServiceGrpc.QueryServiceImplBase {

    @Override
    public void getEntry(QueryServiceOuterClass.QueryGetRequest request, StreamObserver<QueryServiceOuterClass.QueryGetResponse> responseObserver) {
        var token = Token.digestString(request.getKey());

        QueryServiceOuterClass.QueryGetResponse response = QueryServiceOuterClass.QueryGetResponse.newBuilder()
                .addValues(ByteString.copyFromUtf8("value"))
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();

    }

    @Override
    public void putEntry(QueryServiceOuterClass.QueryPutRequest request, StreamObserver<Empty> responseObserver) {

    }
}
