package com.ts.taskswift.exception;

public class ProjectNotFoundException extends RuntimeException {
    private String message;

    public ProjectNotFoundException(String message) {
        super(message);
    }

    public ProjectNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
