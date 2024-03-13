package com.ts.taskswift.controller;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.*;
import com.ts.taskswift.service.ProjectService;
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

    @GetMapping(path = "/projects")
    public ResponseEntity<?> getUserProjects(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Set<Project> projects = projectService.getProjects(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(projects);
    }

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

    @GetMapping(path = "/project/{projectId}/assignedusers")
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

    @PostMapping(path = "/project")
    public ResponseEntity<?> createProject(
            @RequestBody ProjectRequest projectToAdd
    ) {
        Project project = projectService.addProject(projectToAdd);
        return ResponseEntity.status(HttpStatus.OK).body(project);
    }

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
}
