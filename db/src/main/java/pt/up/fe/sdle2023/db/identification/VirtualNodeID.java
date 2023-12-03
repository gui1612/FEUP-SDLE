package pt.up.fe.sdle2023.db.identification;

import java.util.UUID;

public record VirtualNodeID(UUID asUUID) implements Comparable<VirtualNodeID> {

        @Override
        public int compareTo(VirtualNodeID other) {
            return this.asUUID.compareTo(other.asUUID);
        }
}
