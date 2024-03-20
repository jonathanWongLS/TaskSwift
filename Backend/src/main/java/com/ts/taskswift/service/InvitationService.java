package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.AuthenticationResponse;
import com.ts.taskswift.model.Invitation;
import com.ts.taskswift.model.Project;
import com.ts.taskswift.model.User;
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

    public Invitation createInvitationToProject(Long projectId, String email) {
        Invitation invitation = new Invitation();
        Project project = projectService.getProjectById(projectId);
        Set<Invitation> invitationSet;
        UUID inviteToken = UUID.randomUUID();

        invitation.setInviteeEmail(email);
        invitation.setProject(project);
        invitation.setInvitationToken(inviteToken);

        if (project.getInvitations() == null) {
            invitationSet = new HashSet<>();
        } else {
            invitationSet = project.getInvitations();
        }

        invitationSet.add(invitation);
        project.setInvitations(invitationSet);

        projectRepository.save(project);

        return invitation;
    }

    public Invitation loadInvitationByToken(UUID token) {
        return invitationRepository.findByInvitationToken(token).orElseThrow(() -> new ResourceNotFoundException("Invitation with token " + token + " does not exist. User is not registered"));
    }

    public AuthenticationResponse registerUserAndAssignProject(Invitation invitation, User user) {
        AuthenticationResponse registrationToken = authenticationService.register(user);
        User registeredUser = (User) userDetailsService.loadUserByUsername(user.getUsername());
        Project project = invitation.getProject();
        Set<User> assignedUsers = project.getAssignedUsers();
        assignedUsers.add(registeredUser);
        project.setAssignedUsers(assignedUsers);
        projectRepository.save(project);
        invitationRepository.delete(invitation);
        return new AuthenticationResponse(registrationToken.getToken());
    }
}
