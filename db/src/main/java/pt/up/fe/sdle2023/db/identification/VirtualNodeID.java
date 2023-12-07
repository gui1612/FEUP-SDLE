package pt.up.fe.sdle2023.db.identification;

public record VirtualNodeID(Token asToken) implements Comparable<VirtualNodeID> {

        @Override
        public int compareTo(VirtualNodeID other) {
            return this.asToken.compareTo(other.asToken);
        }
}
