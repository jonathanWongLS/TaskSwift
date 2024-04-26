package com.ts.taskswift.controller;

import com.ts.taskswift.exception.UsernameAlreadyExistsException;
import com.ts.taskswift.model.request.AuthenticationResponse;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /**
     * Endpoint for user registration.
     *
     * @param request the User object containing registration details
     * @return ResponseEntity with status 200 and the AuthenticationResponse if successful,
     *         status 400 with an error message if registration values are missing,
     *         or status 409 with an error message if the username already exists
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User request
    ) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One or more register values not found in JSON request!");
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with that username already exists!");
        }
    }

    /**
     * Endpoint for user login.
     *
     * @param request the User object containing login credentials
     * @return ResponseEntity with status 200 and the AuthenticationResponse if login is successful,
     *         or status 401 with an error message if the username or password is invalid
     */
    @PostMapping("/login")
    public ResponseEntity<?> login (
            @RequestBody User request
    ) {
        try {
            AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
            return ResponseEntity.status(HttpStatus.OK).body(authenticationResponse);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }
    }
}
