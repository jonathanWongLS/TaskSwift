package com.ts.taskswift.controller;


import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.AuthenticationResponse;
import com.ts.taskswift.model.Invitation;
import com.ts.taskswift.model.User;
import com.ts.taskswift.service.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1")
@RequiredArgsConstructor
public class InvitationController {
    private final InvitationService invitationService;

    @PostMapping(path = "/invite")
    public ResponseEntity<?> registerUserAndAssignProject(
            @RequestParam("token") UUID inviteToken,
            @RequestBody User user
    ) {
        try {
            Invitation invitation = invitationService.loadInvitationByToken(inviteToken);
            AuthenticationResponse accessToken = invitationService.registerUserAndAssignProject(invitation, user);
            return ResponseEntity.status(HttpStatus.OK).body(accessToken);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found!");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invitation with token " + inviteToken + " does not exist. User is not registered");
        }
    }
}
