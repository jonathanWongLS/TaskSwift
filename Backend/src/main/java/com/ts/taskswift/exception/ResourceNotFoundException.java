package com.ts.taskswift.exception;

/**
 * Custom exception class for handling cases where a general resource is not found.
 */
public class ResourceNotFoundException extends RuntimeException {
    private String message;

    /**
     * Constructs an ResourceNotFoundException with the specified detail message and cause.
     *
     * @param message   the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs an ResourceNotFoundException with the specified detail message and cause.
     *
     * @param message   the detail message
     * @param cause the cause
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
