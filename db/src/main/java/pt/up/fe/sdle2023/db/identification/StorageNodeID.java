package pt.up.fe.sdle2023.db.identification;

public record StorageNodeID(Token asToken) implements Comparable<StorageNodeID> {

    @Override
    public int compareTo(StorageNodeID other) {
        return this.asToken.compareTo(other.asToken);
    }
}