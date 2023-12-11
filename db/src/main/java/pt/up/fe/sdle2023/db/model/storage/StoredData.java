package pt.up.fe.sdle2023.db.model.storage;

import com.google.protobuf.Parser;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.model.ProtoSerializer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StoredData {

    private final List<StoredDataVersion> versions;

    public StoredData(List<StoredDataVersion> versions) {
        this.versions = Collections.unmodifiableList(versions);
    }

    public List<StoredDataVersion> getVersions() {
        return versions;
    }

    public static class Serializer implements ProtoSerializer<StoredData, ModelProtos.StoredData> {

        private static final StoredDataVersion.Serializer storedDataVersionSerializer = new StoredDataVersion.Serializer();

        @Override
        public ModelProtos.StoredData toProto(StoredData model) {
            return ModelProtos.StoredData.newBuilder()
                    .addAllVersions(
                            model.versions.stream()
                                    .map(storedDataVersionSerializer::toProto)
                                    .toList()
                    )
                    .build();
        }

        @Override
        public StoredData fromProto(ModelProtos.StoredData proto) {
            return new StoredData(
                    proto.getVersionsList().stream()
                            .map(storedDataVersionSerializer::fromProto)
                            .toList()
            );
        }

        @Override
        public Parser<ModelProtos.StoredData> createProtoParser() {
            return ModelProtos.StoredData.parser();
        }
    }
}