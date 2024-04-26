package com.ts.taskswift.exception;

/**
 * Custom exception class for handling cases where a project is not found.
 */
public class ProjectNotFoundException extends RuntimeException {
    private String message;

    /**
     * Constructs an ProjectNotFoundException with the specified detail message and cause.
     *
     * @param message   the detail message
     */
    public ProjectNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs an ProjectNotFoundException with the specified detail message.
     *
     * @param message the detail message
     * @param cause the cause
     */
    public ProjectNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
