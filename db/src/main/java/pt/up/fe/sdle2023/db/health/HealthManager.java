package pt.up.fe.sdle2023.db.health;

public class HealthManager {

    public enum State {
        HEALTHY,
        UNHEALTHY,
    }

    private final long timeout;

    private State state = State.HEALTHY;
    private long lastCheck = 0;

    public HealthManager(long timeout) {
        this.timeout = timeout;
    }

    public synchronized boolean isHealthy() {
        var now = System.currentTimeMillis();
        if (state == State.UNHEALTHY && now - lastCheck > timeout) {
            state = State.HEALTHY;
        }

        return state == State.HEALTHY;
    }

    public synchronized void markUnhealthy() {
        state = State.UNHEALTHY;
        lastCheck = System.currentTimeMillis();
    }
}
