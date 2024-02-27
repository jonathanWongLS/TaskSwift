package com.ts.taskswift.controller;

import com.ts.taskswift.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserDetailsServiceImpl userDetailsService;

    @GetMapping(path = "/user/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable("id") Long id
    ) {
        UserDetails user = userDetailsService.loadUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with ID " + id + "!");
        }
        else {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
    }
}
