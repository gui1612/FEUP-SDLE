package pt.up.fe.sdle2023.db.repository;

public class RepositoryOperationFailedException extends Exception {

    public RepositoryOperationFailedException(String message) {
        super(message);
    }

    public RepositoryOperationFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
