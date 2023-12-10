package pt.up.fe.sdle2023.db.model.storage;

import com.google.protobuf.ByteString;
import com.google.protobuf.Parser;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.model.ProtoSerializer;

public class StoredDataVersion {

    private final VectorClock vectorClock;
    private final byte[] data;

    public StoredDataVersion(VectorClock vectorClock, byte[] data) {
        this.vectorClock = vectorClock;
        this.data = data;
    }

    public VectorClock getVectorClock() {
        return vectorClock;
    }

    public byte[] getData() {
        return data;
    }

    public static class Serializer implements ProtoSerializer<StoredDataVersion, ModelProtos.StoredData.Version> {

        private static final VectorClock.Serializer vectorClockSerializer = new VectorClock.Serializer();

        @Override
        public ModelProtos.StoredData.Version toProto(StoredDataVersion model) {
            return ModelProtos.StoredData.Version.newBuilder()
                    .setVectorClock(vectorClockSerializer.toProto(model.getVectorClock()))
                    .setData(ByteString.copyFrom(model.getData()))
                    .build();
        }

        @Override
        public StoredDataVersion fromProto(ModelProtos.StoredData.Version proto) {
            return new StoredDataVersion(
                    vectorClockSerializer.fromProto(proto.getVectorClock()),
                    proto.getData().toByteArray()
            );
        }

        @Override
        public Parser<ModelProtos.StoredData.Version> createProtoParser() {
            return ModelProtos.StoredData.Version.parser();
        }
    }
}
