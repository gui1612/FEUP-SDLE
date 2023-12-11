package pt.up.fe.sdle2023.db.cluster;

import pt.up.fe.sdle2023.db.model.Token;

public class VirtualNode {

    private PhysicalNode physicalNode;
    private final Token token;

    public VirtualNode(PhysicalNode physicalNode, Token token) {
        this.token = token;
    }

    public PhysicalNode getPhysicalNode() {
        return physicalNode;
    }

    public Token getToken() {
        return token;
    }
}
