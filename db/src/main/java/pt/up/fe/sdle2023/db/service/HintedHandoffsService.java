package pt.up.fe.sdle2023.db.service;

import io.grpc.StatusRuntimeException;
import pt.up.fe.sdle2023.db.cluster.PhysicalNodeRegistry;
import pt.up.fe.sdle2023.db.model.storage.HintedHandoffs;
import pt.up.fe.sdle2023.db.repository.HintedHandoffsRepository;
import pt.up.fe.sdle2023.db.repository.RepositoryOperationFailedException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

public class HintedHandoffsService implements Runnable {

    private static final Logger logger = Logger.getLogger(HintedHandoffsService.class.getName());
    private static final long HANDOFF_TIMEOUT = 2;

    private final PhysicalNodeRegistry physicalNodeRegistry;
    private final HintedHandoffsRepository hintedHandoffsRepository;

    public HintedHandoffsService(PhysicalNodeRegistry physicalNodeRegistry, HintedHandoffsRepository hintedHandoffsRepository) {
        this.physicalNodeRegistry = physicalNodeRegistry;
        this.hintedHandoffsRepository = hintedHandoffsRepository;
    }

    @Override
    public void run() {
        logger.info("Hinted handoffs service started");

        try {
            while (true) {
                try {
                    this.flushHintedHandoffs();
                } catch (RepositoryOperationFailedException e) {
                    logger.throwing(HintedHandoffsService.class.getName(), "run", e);
                }

                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            logger.throwing(HintedHandoffsService.class.getName(), "run", e);
        }

        logger.info("Hinted handoffs service stopped");
    }

    private void flushHintedHandoffs() throws RepositoryOperationFailedException, InterruptedException {
        logger.info("Flushing hinted handoffs");

        for (var node : physicalNodeRegistry.getPhysicalNodes()) {
            if (!node.getHealthManager().isHealthy()) continue;

            var hintedHandoffs = hintedHandoffsRepository.get(node.getName())
                .orElseGet(() -> new HintedHandoffs(List.of()));

            var handoffs = hintedHandoffs.getHandoffs();
            if (handoffs.isEmpty()) {
                continue;
            }

            var numHandoffs = handoffs.size();
            var leftoverHandoffs = new ArrayList<ServiceProtos.PutRequest>();

            var stub = DirectQueryServiceGrpc.newBlockingStub(node.getChannel())
                .withDeadlineAfter(HANDOFF_TIMEOUT * numHandoffs, TimeUnit.SECONDS);

            for (var handoff : handoffs) {
                var request = DirectQueryServiceProtos.PutRequestWithHint.newBuilder()
                    .setRequest(handoff)
                    .build();

                try {
                    stub.directPutEntry(request);
                } catch (StatusRuntimeException e) {
                    node.getHealthManager().markUnhealthy();
                    leftoverHandoffs.add(handoff);
                }
            }

            var newHintedHandoffs = new HintedHandoffs(leftoverHandoffs);
            hintedHandoffsRepository.put(node.getName(), newHintedHandoffs);
        }
    }
}
