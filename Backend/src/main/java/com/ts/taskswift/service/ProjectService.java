package com.ts.taskswift.service;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.model.entities.Invitation;
import com.ts.taskswift.model.entities.Project;
import com.ts.taskswift.model.entities.Task;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.model.enums.Status;
import com.ts.taskswift.model.request.*;
import com.ts.taskswift.repository.ProjectRepository;
import com.ts.taskswift.repository.TaskRepository;
import com.ts.taskswift.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final InvitationService invitationService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Retrieves the projects assigned to the user identified by the provided authorization header.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A set of projects assigned to the user.
     */
    public Set<Project> getProjects(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Return project(s) assigned to user
        return user.getAssignedProjects();
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param projectId The ID of the project to retrieve.
     * @return The project with the specified ID, if found.
     * @throws ProjectNotFoundException If no project with the given ID exists.
     */
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));
    }

    /**
     * Retrieves the number of unfinished number of assigned tasks and total number of tasks for each project assigned to the user.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A list of project task summaries.
     */
    public List<ProjectTaskSummary> getProjectTaskSummary(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Retrieve projects assigned to user
        Set<Project> assignedProjects = user.getAssignedProjects();

        // Get all projects' details, the project's number of unfinished tasks and the project's number of total tasks
        List<ProjectTaskSummary> projectsAndNumberOfNonDoneTasks = new ArrayList<>();
        for (Project project: assignedProjects) {
            int numberOfTasksWithNonDoneStatus = 0;
            for (Task task: project.getTasks()) {
                if (task.getTaskStatus() != Status.DONE) {
                    numberOfTasksWithNonDoneStatus++;
                }
            }
            projectsAndNumberOfNonDoneTasks.add(
                    new ProjectTaskSummary(
                            project,
                            numberOfTasksWithNonDoneStatus,
                            project.getTasks().size()
                    )
            );
        }
        return projectsAndNumberOfNonDoneTasks;
    }

    /**
     * Retrieves the progress summary for each project assigned to the user.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A list of project progress summaries.
     */
    public List<ProjectProgress> getProjectProgress(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        ProjectProgress projectProgress;
        List<ProjectProgress> projectProgressList = new ArrayList<>();
        int todoCount;          // Number of tasks with To Do status
        int inProgressCount;    // Number of tasks with In Progress status
        int doneCount;          // Number of tasks with Done status

        // Iterate through assigned projects to calculate progress
        for (Project project: user.getAssignedProjects()) {
            // Create a new instance of ProjectProgress for each project
            projectProgress = new ProjectProgress();

            // Reset counts for each project
            todoCount = 0;
            inProgressCount = 0;
            doneCount = 0;

            // Set the project for the progress
            projectProgress.setProject(project);

            // Iterate through tasks of the project to count statuses
            for (Task task: project.getTasks()) {
                if (task.getTaskStatus() == Status.TO_DO) {
                    todoCount++;
                } else if (task.getTaskStatus() == Status.IN_PROGRESS) {
                    inProgressCount++;
                 } else if (task.getTaskStatus() == Status.DONE) {
                    doneCount++;
                }
            }

            // Set the counts for each status in the project progress
            projectProgress.setNumberOfTodoTasks(todoCount);
            projectProgress.setNumberOfInProgressTasks(inProgressCount);
            projectProgress.setNumberOfDoneTasks(doneCount);

            // Add the project progress to the list
            projectProgressList.add(projectProgress);
        }

        return projectProgressList;
    }

    /**
     * Retrieves the workload distribution for tasks assigned to the user across projects.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A list of workload distribution summaries.
     */
    public List<WorkloadDistribution> getWorkloadDistribution(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Retrieve projects assigned to user
        Set<Project> assignedProjects = user.getAssignedProjects();

        List<WorkloadDistribution> workloadDistributionList = new ArrayList<>();
        WorkloadDistribution workloadDistribution;

        // Iterate through tasks of each project and get the number of tasks the user is assigned to
        for (Project project: assignedProjects) {
            int assignedTasksCount = 0;
            workloadDistribution = new WorkloadDistribution();
            workloadDistribution.setProject(project);

            for (Task task: project.getTasks()) {
                if (task.getAssignedUsers().contains(user)) {
                    assignedTasksCount++;
                }
            }

            workloadDistribution.setAssignedTasksCount(assignedTasksCount);
            workloadDistribution.setTotalTasksCount(project.getTasks().size());

            workloadDistributionList.add(workloadDistribution);
        }
        return workloadDistributionList;
    }

    /**
     * Adds users to the list of assigned users for a specific project and sends invitations to unregistered users.
     *
     * @param projectId             The ID of the project to which users will be added.
     * @param newAssignedUsersEmails The list of email addresses of users to be added.
     * @return The updated project after adding assigned users.
     * @throws MessagingException If an error occurs while sending invitations.
     */
    public Project addAssignedUsers(Long projectId, List<String> newAssignedUsersEmails) throws MessagingException {
        // Retrieve project details with provided project ID
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));

        // Retrieve registered and unregistered user(s) from list of email addresses newAssignedUsersEmails
        RegisteredAndUnregisteredUsers listOfUsers = userDetailsService.loadUsersByEmail(newAssignedUsersEmails);

        // Add registered users to the project
        Set<User> assignedUsers = project.getAssignedUsers();
        Set<User> newAssignedUsers = listOfUsers.getRegisteredUserSet();
        assignedUsers.addAll(newAssignedUsers);
        project.setAssignedUsers(assignedUsers);

        Project updatedProject = projectRepository.save(project);

        // Send invitation emails to unregistered users
        for (String inviteeEmail: listOfUsers.getUnregisteredEmailSet()) {
            Invitation invitation = invitationService.createInvitationToProject(project.getProjectId(), inviteeEmail);
            String emailHtml = buildProjectInviteEmail(project.getProjectName(), invitation.getInvitationToken());
            emailService.send(inviteeEmail, emailHtml);
        }

        return projectRepository.findById(updatedProject.getProjectId()).orElseThrow();
    }

    /**
     * Builds an email for inviting users to join a project.
     *
     * @param projectName The name of the project.
     * @param token       The invitation token.
     * @return The email content with placeholders replaced.
     */
    public static String buildProjectInviteEmail(String projectName, UUID token) {
        String urlStr = "https://raw.githubusercontent.com/jonathanWongLS/TaskSwift/main/Backend/src/main/java/com/ts/taskswift/email/ProjectInvite.html";
        StringBuilder emailBuilder = new StringBuilder();

        try {
            // Create a URL object
            URL url = new URL(urlStr);

            // Open a connection to the URL
            BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));

            // Read the HTML content line by line
            String line;
            while ((line = reader.readLine()) != null) {
                line = line
                        .replace("{ProjectName}", projectName)
                        .replace("{InviteLink}", "http://taskswift.com/sign-up?token=" + token);
                emailBuilder.append(line);
                emailBuilder.append("\n");
            }

            // Close the reader
            reader.close();
        } catch (IOException e) {
            System.err.println("Error reading from URL: " + e.getMessage());
        }

        return emailBuilder.toString();
    }

    /**
     * Creates a new project and assigns it to the user, adding additional assigned users if specified.
     *
     * @param createProjectRequest The request containing project details.
     * @param authorizationHeader  The authorization header containing the JWT token.
     * @return The newly created project.
     * @throws MessagingException If an error occurs while sending invitations.
     */
    public Project createProject(CreateProjectRequest createProjectRequest, String authorizationHeader) throws MessagingException {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Get project to be added
        Project projectToAdd = createProjectRequest.getProject();

        // Assign the project to the project creator
        Set<User> assignedUsers = projectToAdd.getAssignedUsers();
        assignedUsers.add(user);

        // Add registered users to the project
        List<String> assignedUserIdList = createProjectRequest.getAssignedUserEmail();
        RegisteredAndUnregisteredUsers listOfUsers = userDetailsService.loadUsersByEmail(assignedUserIdList);
        assignedUsers.addAll(listOfUsers.getRegisteredUserSet());
        projectToAdd.setAssignedUsers(assignedUsers);

        Project addedProject = projectRepository.save(projectToAdd);

        // Send invitation emails to unregistered users
        for (String inviteeEmail: listOfUsers.getUnregisteredEmailSet()) {
            Invitation invitation = invitationService.createInvitationToProject(createProjectRequest.getProject().getProjectId(), inviteeEmail);
            String emailHtml = buildProjectInviteEmail(createProjectRequest.getProject().getProjectName(), invitation.getInvitationToken());
            emailService.send(inviteeEmail, emailHtml);
        }

        return projectRepository.findById(addedProject.getProjectId()).orElseThrow();
    }

    /**
     * Updates an existing project with new details.
     *
     * @param projectId      The ID of the project to update.
     * @param updatedProject The updated project details.
     * @return The updated project.
     */
    public Project updateProject(Long projectId, Project updatedProject) {
        return projectRepository
                .findById(projectId)
                .map(
                        selectedProject -> {
                            if (updatedProject.getProjectName() != null)
                                selectedProject.setProjectName(updatedProject.getProjectName());

                            if (updatedProject.getProjectDescription() != null)
                                selectedProject.setProjectDescription(updatedProject.getProjectDescription());

                            if (!updatedProject.getAssignedUsers().isEmpty())
                                selectedProject.setAssignedUsers(updatedProject.getAssignedUsers());

                            return projectRepository.save(selectedProject);
                        }
                        ).orElseThrow(() -> new ProjectNotFoundException(
                                "Project with ID " + projectId + " not found. Cannot update non-existent project!"
                        )
                );
    }

    /**
     * Deletes a project and removes its association from assigned users.
     *
     * @param projectId The ID of the project to delete.
     * @throws ProjectNotFoundException If the project with the given ID is not found.
     */
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));

        // Remove project from all assigned users' list of assigned projects
        for (User user: project.getAssignedUsers()) {
            user.getAssignedProjects().remove(project);
            userRepository.save(user);
        }

        // Remove all assigned users from the project's list of assigned users
        project.getAssignedUsers().clear();

        // Delete project from database
        projectRepository.delete(project);
    }

    /**
     * Removes a member from a project, including removing their association from tasks within the project.
     *
     * @param projectId              The ID of the project from which the member will be removed.
     * @param projectMemberToRemoveId The ID of the member to remove.
     * @throws ProjectNotFoundException If the project with the given ID is not found.
     */
    public void deleteProjectMemberFromProject(Long projectId, Long projectMemberToRemoveId) {

        // Retrieve the project by its ID or throw an exception if not found
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));

        // Retrieve the set of assigned users to the project
        Set<User> users = project.getAssignedUsers();

        // Remove the member with the specified ID from the assigned users
        users.removeIf(user -> user.getId().equals(projectMemberToRemoveId));

        // Update the project with the modified set of assigned users
        project.setAssignedUsers(users);

        // Iterate through each task in the project
        for (Task task : project.getTasks()) {
            // Retrieve the set of assigned users to the current task
            Set<User> currTaskAssignedUsers = task.getAssignedUsers();

            // Remove the member with the specified ID from the assigned users of the task
            currTaskAssignedUsers.removeIf(assignedUser -> assignedUser.getId().equals(projectMemberToRemoveId));

            // Update the task with the modified set of assigned users
            task.setAssignedUsers(currTaskAssignedUsers);

            // Save the task changes to the database
            taskRepository.save(task);
        }

        // Save the project changes to the database
        projectRepository.save(project);
    }
}
