package com.ts.taskswift.exception;

/**
 * Custom exception class for handling cases where a task is not found.
 */
public class TaskNotFoundException extends RuntimeException {
    private String message;

    /**
     * Constructs an TaskNotFoundException with the specified detail message and cause.
     *
     * @param message   the detail message
     */
    public TaskNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs an TaskNotFoundException with the specified detail message and cause.
     *
     * @param message   the detail message
     * @param cause the cause
     */
    public TaskNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
