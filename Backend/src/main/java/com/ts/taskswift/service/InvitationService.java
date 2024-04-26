package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.request.AuthenticationResponse;
import com.ts.taskswift.model.entities.Invitation;
import com.ts.taskswift.model.entities.Project;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.repository.InvitationRepository;
import com.ts.taskswift.repository.ProjectRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final AuthenticationService authenticationService;
    private final UserDetailsServiceImpl userDetailsService;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public InvitationService(InvitationRepository invitationRepository, AuthenticationService authenticationService, UserDetailsServiceImpl userDetailsService, ProjectRepository projectRepository, @Lazy ProjectService projectService) {
        this.invitationRepository = invitationRepository;
        this.authenticationService = authenticationService;
        this.userDetailsService = userDetailsService;
        this.projectRepository = projectRepository;
        this.projectService = projectService;
    }

    /**
     * Creates an invitation for a project.
     *
     * @param projectId the ID of the project to create the invitation for
     * @param email the email of the invitee
     * @return the created invitation
     */
    public Invitation createInvitationToProject(Long projectId, String email) {
        Invitation invitation = new Invitation();
        Project project = projectService.getProjectById(projectId);
        Set<Invitation> invitationSet;

        // Generating a new invitation token to project
        UUID inviteToken = UUID.randomUUID();

        // Setting invitation details
        invitation.setInviteeEmail(email);
        invitation.setProject(project);
        invitation.setInvitationToken(inviteToken);

        // Adding invitation to project's set of invitation
        if (project.getInvitations() == null) {
            invitationSet = new HashSet<>();
        } else {
            invitationSet = project.getInvitations();
        }

        // Adding the new invitation to the set
        invitationSet.add(invitation);
        project.setInvitations(invitationSet);

        // Saving the updated project with the new invitation
        projectRepository.save(project);

        return invitation;
    }

    /**
     * Loads an invitation by its token.
     *
     * @param token the token of the invitation to load
     * @return the loaded invitation
     * @throws ResourceNotFoundException if the invitation with the token does not exist
     */
    public Invitation loadInvitationByToken(UUID token) {
        return invitationRepository.findByInvitationToken(token).orElseThrow(() -> new ResourceNotFoundException("Invitation with token " + token + " does not exist. User is not registered"));
    }

    /**
     * Registers a user from an invitation and assigns them to a project.
     *
     * @param invitation the invitation to register from
     * @param user       the user to register
     * @return the authentication response token after registering the user
     */
    public AuthenticationResponse registerUserAndAssignProject(Invitation invitation, User user) {
        // Registering the user
        AuthenticationResponse registrationToken = authenticationService.register(user);

        // Retrieving the registered user
        User registeredUser = (User) userDetailsService.loadUserByUsername(user.getUsername());

        // Getting the project from the invitation
        Project project = invitation.getProject();

        // Updating the project's assigned users
        Set<User> assignedUsers = project.getAssignedUsers();
        assignedUsers.add(registeredUser);
        project.setAssignedUsers(assignedUsers);

        // Saving the updated project and removing the invitation
        projectRepository.save(project);
        invitationRepository.delete(invitation);

        return new AuthenticationResponse(registrationToken.getToken());
    }
}
