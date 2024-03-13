package com.ts.taskswift.exception;

import org.springframework.security.core.AuthenticationException;

public class UsernameAlreadyExistsException extends AuthenticationException {

    public UsernameAlreadyExistsException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public UsernameAlreadyExistsException(String msg) {
        super(msg);
    }
}
