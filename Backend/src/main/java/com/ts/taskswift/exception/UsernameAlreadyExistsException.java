package com.ts.taskswift.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Custom exception class for handling cases where a username already exists and is used during registration by another user.
 */
public class UsernameAlreadyExistsException extends AuthenticationException {

    /**
     * Constructs an UsernameAlreadyExistsException with the specified detail message and cause.
     *
     * @param msg   the detail message
     * @param cause the cause
     */
    public UsernameAlreadyExistsException(String msg, Throwable cause) {
        super(msg, cause);
    }

    /**
     * Constructs an UsernameAlreadyExistsException with the specified detail message and cause.
     *
     * @param msg   the detail message
     */
    public UsernameAlreadyExistsException(String msg) {
        super(msg);
    }
}
