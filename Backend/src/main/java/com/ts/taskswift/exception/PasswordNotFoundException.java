package com.ts.taskswift.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Custom exception class for handling cases where a password is not found.
 */
public class PasswordNotFoundException extends AuthenticationException {

    /**
     * Constructs an PasswordNotFoundException with the specified detail message and cause.
     *
     * @param msg   the detail message
     * @param cause the cause
     */
    public PasswordNotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    /**
     * Constructs an PasswordNotFoundException with the specified detail message.
     *
     * @param msg the detail message
     */
    public PasswordNotFoundException(String msg) {
        super(msg);
    }
}
