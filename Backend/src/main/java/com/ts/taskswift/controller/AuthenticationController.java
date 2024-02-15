package com.ts.taskswift.controller;

import com.ts.taskswift.model.AuthenticationResponse;
import com.ts.taskswift.model.User;
import com.ts.taskswift.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody User request
    ) throws Exception {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login (
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
