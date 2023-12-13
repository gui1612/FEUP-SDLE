package pt.up.fe.sdle2023.db.model.storage;

import com.google.protobuf.Parser;
import pt.up.fe.sdle2023.db.model.ProtoSerializer;
import pt.up.fe.sdle2023.db.service.ServiceProtos;

import java.util.Collections;
import java.util.List;

public class HintedHandoffs {

    private final List<ServiceProtos.PutRequest> handoffs;

    public HintedHandoffs(List<ServiceProtos.PutRequest> handoffs) {
        this.handoffs = Collections.unmodifiableList(handoffs);
    }

    public List<ServiceProtos.PutRequest> getHandoffs() {
        return handoffs;
    }

    public static class Serializer implements ProtoSerializer<HintedHandoffs, ServiceProtos.HintedHandoffs> {
        @Override
        public ServiceProtos.HintedHandoffs toProto(HintedHandoffs model) {
            return ServiceProtos.HintedHandoffs.newBuilder()
//                .setPhysicalNodeName(model.physicalNodeName)
                .addAllRequests(model.getHandoffs())
                .build();
        }

        @Override
        public HintedHandoffs fromProto(ServiceProtos.HintedHandoffs proto) {
            return new HintedHandoffs(
//                proto.getPhysicalNodeName(),
                proto.getRequestsList());
        }

        @Override
        public Parser<ServiceProtos.HintedHandoffs> createProtoParser() {
            return ServiceProtos.HintedHandoffs.parser();
        }
    }
}
