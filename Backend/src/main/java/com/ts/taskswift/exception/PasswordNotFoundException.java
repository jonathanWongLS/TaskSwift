package com.ts.taskswift.exception;

import org.springframework.security.core.AuthenticationException;

public class PasswordNotFoundException extends AuthenticationException {

    public PasswordNotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public PasswordNotFoundException(String msg) {
        super(msg);
    }
}
