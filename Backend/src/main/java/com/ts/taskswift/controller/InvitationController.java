package com.ts.taskswift.controller;


import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.request.AuthenticationResponse;
import com.ts.taskswift.model.entities.Invitation;
import com.ts.taskswift.model.entities.User;
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

    /**
     * Endpoint for registering a user and assigning a project based on an invitation token.
     *
     * @param inviteToken the invitation token used to identify the invitation
     * @param user        the User object containing user details for registration
     * @return ResponseEntity with status 200 and the AuthenticationResponse if successful,
     *         or status 404 with an error message if the username is not found,
     *         or status 404 with an error message if the invitation token does not exist
     */
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
