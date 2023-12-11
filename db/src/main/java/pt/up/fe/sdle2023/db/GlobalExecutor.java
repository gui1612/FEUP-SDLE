package pt.up.fe.sdle2023.db;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class GlobalExecutor {

    private static final Executor executor = Executors.newVirtualThreadPerTaskExecutor();

    public static Executor getExecutor() {
        return executor;
    }
}
