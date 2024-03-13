package com.ts.taskswift.exception;

public class TaskNotFoundException extends RuntimeException {
    private String message;

    public TaskNotFoundException(String message) {
        super(message);
    }

    public TaskNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
