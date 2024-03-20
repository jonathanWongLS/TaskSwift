package com.ts.taskswift.service;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.model.*;
import com.ts.taskswift.repository.ProjectRepository;
import com.ts.taskswift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final InvitationService invitationService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public Set<Project> getProjects(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);
        return user.getAssignedProjects();
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));
    }

    public List<ProjectTaskSummary> getProjectTaskSummary(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        Set<Project> assignedProjects = user.getAssignedProjects();
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

    public ProjectProgress getProjectProgress(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        ProjectProgress projectProgress = new ProjectProgress();
        Set<Project> assignedProjects = new HashSet<>();
        int todoCount = 0;
        int inProgressCount = 0;
        int doneCount = 0;

        for (Project project: user.getAssignedProjects()) {
            assignedProjects.add(project);
            for (Task task: project.getTasks()) {
                if (task.getTaskStatus() == Status.TO_DO) {
                    todoCount++;
                } else if (task.getTaskStatus() == Status.IN_PROGRESS) {
                    inProgressCount++;
                 } else if (task.getTaskStatus() == Status.DONE) {
                    doneCount++;
                }
            }
        }

        projectProgress.setNumberOfTodoTasks(todoCount);
        projectProgress.setNumberOfInProgressTasks(inProgressCount);
        projectProgress.setNumberOfDoneTasks(doneCount);
        projectProgress.setProject(assignedProjects);
        return projectProgress;
    }

    public List<WorkloadDistribution> getWorkloadDistribution(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        Set<Project> assignedProjects = user.getAssignedProjects();
        List<WorkloadDistribution> workloadDistributionList = new ArrayList<>();
        WorkloadDistribution workloadDistribution;

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
            workloadDistribution.setTotalTasksCount(project.getAssignedUsers().size());

            workloadDistributionList.add(workloadDistribution);
        }
        return workloadDistributionList;
    }

    public Project addAssignedUsers(Long projectId, List<String> newAssignedUsersEmails) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));
        RegisteredAndUnregisteredUsers listOfUsers = userDetailsService.loadUsersByEmail(newAssignedUsersEmails);
        Set<User> assignedUsers = project.getAssignedUsers();
        Set<User> newAssignedUsers = listOfUsers.getRegisteredUserSet();
        assignedUsers.addAll(newAssignedUsers);
        project.setAssignedUsers(assignedUsers);

        for (String inviteeEmail: listOfUsers.getUnregisteredEmailSet()) {
            Invitation invitation = invitationService.createInvitationToProject(project.getProjectId(), inviteeEmail);
            String emailHtml = buildProjectInviteEmail(project.getProjectName(), invitation.getInvitationToken());
            emailService.send(inviteeEmail, emailHtml);
        }

        return projectRepository.save(project);
    }

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
                        .replace("{InviteLink}", "http://taskswift.com/register/?token=" + token);
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

    public Project createProject(CreateProjectRequest createProjectRequest, String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        Project projectToAdd = createProjectRequest.getProject();

        Set<User> assignedUsers = projectToAdd.getAssignedUsers();
        assignedUsers.add(user);

        List<String> assignedUserIdList = createProjectRequest.getAssignedUserEmail();
        RegisteredAndUnregisteredUsers listOfUsers = userDetailsService.loadUsersByEmail(assignedUserIdList);
        assignedUsers.addAll(listOfUsers.getRegisteredUserSet());
        projectToAdd.setAssignedUsers(assignedUsers);

        for (String inviteeEmail: listOfUsers.getUnregisteredEmailSet()) {
            Invitation invitation = invitationService.createInvitationToProject(createProjectRequest.getProject().getProjectId(), inviteeEmail);
            String emailHtml = buildProjectInviteEmail(createProjectRequest.getProject().getProjectName(), invitation.getInvitationToken());
            emailService.send(inviteeEmail, emailHtml);
        }

        return projectRepository.save(projectToAdd);
    }

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

    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));
        for (User user: project.getAssignedUsers()) {
            user.getAssignedProjects().remove(project);
            userRepository.save(user);
        }
        project.getAssignedUsers().clear();

        projectRepository.delete(project);
    }
}
