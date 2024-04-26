package com.ts.taskswift.controller;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.entities.Project;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.model.request.CreateProjectRequest;
import com.ts.taskswift.model.request.ProjectProgress;
import com.ts.taskswift.model.request.WorkloadDistribution;
import com.ts.taskswift.service.ProjectService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path = "api/v1")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Endpoint for retrieving projects assigned to a user.
     *
     * @param authorizationHeader [Request Header] the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and a Set of projects if successful
     */
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(path = "/projects")
    public ResponseEntity<?> getUserProjects(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Set<Project> projects = projectService.getProjects(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(projects);
    }

    /**
     * Endpoint for retrieving a project by its ID.
     *
     * @param id [Path Variable] the ID of the project to retrieve
     * @return ResponseEntity with status 200 and the project if found,
     *         or status 404 with an error message if the project is not found
     */
    @GetMapping(path = "/project/{projectId}")
    public ResponseEntity<?> getProject(
            @PathVariable("projectId") Long id
    ) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.status(HttpStatus.OK).body(project);
        }
        catch(ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + id + " does not exist!");
        }
    }

    /**
     * Endpoint for retrieving assigned users of a project.
     *
     * @param projectId [Path Variable] the ID of the project to retrieve assigned users from
     * @return ResponseEntity with status 200 and a Set of assigned users if successful,
     *         or status 404 with an error message if the project is not found
     */
    @GetMapping(path = "/project/{projectId}/assigned-users")
    public ResponseEntity<?> getProjectAssignedUsers(
            @PathVariable("projectId") Long projectId
    ) {
        try {
            Project project = projectService.getProjectById(projectId);
            Set<User> assignedUsers = project.getAssignedUsers();
            return ResponseEntity.status(HttpStatus.OK).body(assignedUsers);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " does not exist!");
        }
    }

    /**
     * Endpoint for retrieving project progress.
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and a List of ProjectProgress objects if successful,
     *         or status 404 with an error message if the username is not found
     */
    @GetMapping(path = "/project-progress")
    public ResponseEntity<?> getProjectProgress(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            List<ProjectProgress> projectProgressList = projectService.getProjectProgress(authorizationHeader);
            return ResponseEntity.status(HttpStatus.OK).body(projectProgressList);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username does not exist!");
        }
    }

    /**
     * Endpoint for retrieving workload distribution.
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and a List of WorkloadDistribution objects if successful,
     *         or status 404 with an error message if the username is not found
     */
    @GetMapping(path = "/workload-distribution")
    public ResponseEntity<?> getWorkloadDistribution(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            List<WorkloadDistribution> workloadDistributionList = projectService.getWorkloadDistribution(authorizationHeader);
            return ResponseEntity.status(HttpStatus.OK).body(workloadDistributionList);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username does not exist!");
        }
    }

    /**
     * Endpoint for creating a project.
     *
     * @param projectToAdd        the CreateProjectRequest containing the project details
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and the created project if successful,
     *         or status 409 with an error message if the invite email is not sent
     * @throws MessagingException if an error occurs while sending the invite email
     */
    @PostMapping(path = "/project")
    public ResponseEntity<?> createProject(
            @RequestBody CreateProjectRequest projectToAdd,
            @RequestHeader("Authorization") String authorizationHeader
    ) throws MessagingException {
        Project project = projectService.createProject(projectToAdd,authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(project);
    }

    /**
     * Endpoint for getting number of unfinished tasks, total number of tasks of all projects assigned to user.
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 if the project task summary is received successfully,
     *         or status 404 with an error message if the username is not found
     */
    @GetMapping(path = "/project-task-summary")
    public ResponseEntity<?> getProjectTaskSummary(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(projectService.getProjectTaskSummary(authorizationHeader));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found!");
        }
    }

    /**
     * Endpoint for adding assigned users to a project.
     *
     * @param projectId           the ID of the project to add users to
     * @param newAssignedUsersEmails the list of emails of users to be added to the project
     * @return ResponseEntity with status 200 and the updated project if successful,
     *         or status 404 with an error message if the project is not found,
     *         or status 409 with an error message if the invite email is not sent
     */
    @PostMapping(path = "/project/{projectId}/assign-users")
    public ResponseEntity<?> addAssignedUsersToProject(
            @PathVariable("projectId") Long projectId,
            @RequestBody List<String> newAssignedUsersEmails
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(projectService.addAssignedUsers(projectId, newAssignedUsersEmails));
        } catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " does not exist!");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invite email not sent!");
        }
    }

    /**
     * Endpoint for updating a project.
     *
     * @param projectId     the ID of the project to update
     * @param updatedProject the updated project details
     * @return ResponseEntity with status 200 and the updated project if successful,
     *         or status 404 with an error message if the project is not found
     */
    @PutMapping(path = "/project/{projectId}")
    public ResponseEntity<?> updateProject(
            @PathVariable("projectId") Long projectId,
            @RequestBody Project updatedProject
    ) {
        try {
            Project project = projectService.updateProject(projectId, updatedProject);
            return ResponseEntity.status(HttpStatus.OK).body(project);
        }
        catch(ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " does not exist!");
        }
    }

    /**
     * Endpoint for deleting a project.
     *
     * @param projectId the ID of the project to delete
     * @return ResponseEntity with status 200 if successful,
     *         or status 404 with an error message if the project is not found
     */
    @DeleteMapping(path = "/project/{projectId}")
    public ResponseEntity<?> deleteProject(
            @PathVariable("projectId") Long projectId
    ) {
        try {
            projectService.deleteProject(projectId);
            return ResponseEntity.status(HttpStatus.OK).body("Project with ID " + projectId + " is deleted!");
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " cannot be found!");
        }
    }

    /**
     * Endpoint for removing a project member from a project.
     *
     * @param projectId             the ID of the project
     * @param projectMemberToRemoveId the ID of the project member to remove
     * @return ResponseEntity with status 200 if successful,
     *         or status 404 with an error message if the project or project member is not found
     */
    @DeleteMapping(path = "/project/{projectId}/remove/{projectMemberId}")
    public ResponseEntity<?> deleteProjectMemberFromProject(
        @PathVariable("projectId") Long projectId,
        @PathVariable("projectMemberId") Long projectMemberToRemoveId
    ) {
        try {
            projectService.deleteProjectMemberFromProject(projectId, projectMemberToRemoveId);
            return ResponseEntity.status(HttpStatus.OK).body("Member with ID " + projectMemberToRemoveId + " have been removed from project with ID " + projectId + "!");
        }
        catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " does not exist!");
        }
    }
}
