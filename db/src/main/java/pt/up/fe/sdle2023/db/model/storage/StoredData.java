package pt.up.fe.sdle2023.db.model.storage;

import com.google.protobuf.Parser;
import pt.up.fe.sdle2023.db.model.ModelProtos;
import pt.up.fe.sdle2023.db.model.ProtoSerializer;

import java.util.*;
import java.util.stream.Stream;

public class StoredData {

    private final List<StoredDataVersion> versions;

    public StoredData(Collection<StoredDataVersion> versions) {
        this.versions = new ArrayList<>(versions);
    }

    public List<StoredDataVersion> getVersions() {
        return Collections.unmodifiableList(versions);
    }

    public StoredData compact() {
        var currentVersions = new ArrayList<>(versions);

        var comparator = Comparator.comparing(StoredDataVersion::getVectorClock, VectorClock::compareTo);
        currentVersions.sort(comparator.reversed());

        var compactedVersions = new ArrayList<StoredDataVersion>();

        for (var version : currentVersions) {
            var versionClock = version.getVectorClock();

            var isAncestorOfElement = compactedVersions.stream()
                    .anyMatch(compactedVersion -> versionClock.isAncestor(compactedVersion.getVectorClock()));

            if (!isAncestorOfElement) {
                compactedVersions.add(version);
            }
        }

        return new StoredData(compactedVersions);
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