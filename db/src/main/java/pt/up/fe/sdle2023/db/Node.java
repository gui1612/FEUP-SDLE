package pt.up.fe.sdle2023.db;

import pt.up.fe.sdle2023.db.config.data.NodeConfig;
import pt.up.fe.sdle2023.db.health.NodeHealthManager;
import pt.up.fe.sdle2023.db.partitioning.PartitionNode;

public record Node(NodeConfig config, NodeHealthManager healthManager, PartitionNode partitionNode) {

}
