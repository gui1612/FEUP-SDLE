package pt.up.fe.sdle2023.db.health;

public class NodeHealthManager {

    public enum State {
        UNKNOWN,
        HEALTHY,
        UNHEALTHY,
    }

    private final long timeout;

    private State state = State.UNKNOWN;
    private long lastCheck = 0;

    public NodeHealthManager(long timeout) {
        this.timeout = timeout;
    }

    public boolean isUnhealthy() {
        var now = System.currentTimeMillis();
        if (state == State.UNHEALTHY && now - lastCheck > timeout) {
            state = State.UNKNOWN;
        }

        return state == State.UNHEALTHY;
    }

    public void markUnhealthy() {
        state = State.UNHEALTHY;
        lastCheck = System.currentTimeMillis();
    }
}
