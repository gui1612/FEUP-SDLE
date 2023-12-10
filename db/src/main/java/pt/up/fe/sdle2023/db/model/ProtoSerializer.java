package pt.up.fe.sdle2023.db.model;

import com.google.protobuf.GeneratedMessageV3;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Parser;

public interface ProtoSerializer<T, U extends GeneratedMessageV3> {
    U toProto(T model);
    T fromProto(U proto);

    Parser<U> createProtoParser();

    default T fromBytes(byte[] bytes) throws InvalidProtocolBufferException {
        var parser = createProtoParser();
        var proto = parser.parseFrom(bytes);
        return fromProto(proto);
    }

    default byte[] toBytes(T model) {
        var proto = toProto(model);
        return proto.toByteArray();
    }
}
