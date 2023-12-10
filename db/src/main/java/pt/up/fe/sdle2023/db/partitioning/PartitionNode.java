package pt.up.fe.sdle2023.db.partitioning;

import pt.up.fe.sdle2023.db.model.Token;

public record PartitionNode(Token storageToken, Token token) implements Comparable<PartitionNode> {

    public boolean isSibling(PartitionNode other) {
        return this.storageToken.equals(other.storageToken);
    }

    @Override
    public int compareTo(PartitionNode other) {
        return this.token.compareTo(other.token());
    }
}
