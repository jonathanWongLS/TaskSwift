package com.ts.taskswift.controller;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.TaskAndProjectName;
import com.ts.taskswift.model.TaskRequest;
import com.ts.taskswift.model.Task;
import com.ts.taskswift.model.User;
import com.ts.taskswift.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path = "api/v1")
@RequiredArgsConstructor
public class TaskController {
    @Autowired
    private final TaskService taskService;

    @GetMapping(path = "/task/{taskId}")
    public ResponseEntity<?> getTaskById(
            @PathVariable("taskId") Long taskId
    ) {
        try {
            Task task = taskService.getTaskById(taskId);
            return ResponseEntity.status(HttpStatus.OK).body(task);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with ID " + taskId + " not found!");
        }
    }

    @GetMapping(path = "/project/{projectId}/tasks")
    public ResponseEntity<?> getTasksFromProject(
            @PathVariable("projectId") Long projectId
    ) {
        try {
            List<Task> tasks = taskService.getTasksFromProject(projectId);
            return ResponseEntity.status(HttpStatus.OK).body(tasks);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Attempted to find tasks from project with ID " + projectId + " returned null");
        }
    }

    @GetMapping(path = "/project/{projectId}/tasks/{taskId}")
    public ResponseEntity<?> getTaskFromProject(
            @PathVariable("projectId") Long projectId,
            @PathVariable("taskId") Long taskId
    ) {
        try {
            Task task = taskService.getTaskFromProject(taskId, projectId);
            return ResponseEntity.status(HttpStatus.OK).body(task);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with ID " + taskId + " does not exist in project with ID " + projectId + "!");
        }
    }

    @GetMapping(path = "/task-count-status")
    public ResponseEntity<?> getTaskCountByStatus(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            int[] taskCountByStatus = taskService.getTaskCountByStatus(authorizationHeader);
            return ResponseEntity.status(HttpStatus.OK).body(taskCountByStatus);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username does not exist!");
        }
    }

    @GetMapping(path = "/tasks-ordered-by-datetime-desc")
    public ResponseEntity<?> getTasksOrderedByDatetimeDesc(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            List<TaskAndProjectName> tasks = taskService.getTasksOrderedByDatetimeDesc(authorizationHeader);
            return ResponseEntity.status(HttpStatus.OK).body(tasks);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username does not exist!");
        }
    }

    @GetMapping(path = "/priority-tasks")
    public ResponseEntity<?> getPriorityTasks(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            List<TaskAndProjectName> tasks = taskService.getPriorityTasks(authorizationHeader);
            return ResponseEntity.status(HttpStatus.OK).body(tasks);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username does not exist!");
        }
    }

    @PostMapping(path = "/add-task/{projectId}")
    public ResponseEntity<?> addTaskToProject(
            @PathVariable("projectId") Long projectId,
            @RequestBody TaskRequest addTaskToProjectRequest
    ) {
        try {
            Task addedTask = taskService.addTaskToProject(projectId, addTaskToProjectRequest);
            return ResponseEntity.status(HttpStatus.OK).body(addedTask);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project with ID " + projectId + " not found!");
        }
    }

    @PutMapping(path = "/project/{projectId}/task/{taskId}")
    public ResponseEntity<?> updateTaskInProject(
            @PathVariable("projectId") Long projectId,
            @PathVariable("taskId") Long taskId,
            @RequestBody TaskRequest updatedTaskRequest
    ) {
        try {
            Task project = taskService.updateTaskInProject(projectId, taskId, updatedTaskRequest);
            return ResponseEntity.status(HttpStatus.OK).body(project);
        }
        catch(ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with ID " + taskId + " in project " + projectId + " not found. Cannot update non-existent task!");
        }
    }

    @DeleteMapping(path = "/project/{projectId}/task/{taskId}")
    public ResponseEntity<?> deleteTaskInProject(
            @PathVariable("projectId") Long projectId,
            @PathVariable("taskId") Long taskId
    ) {
        try {
            taskService.deleteTaskInProject(projectId, taskId);
            return ResponseEntity.status(HttpStatus.OK).body("Task with ID " + taskId + " in project " + projectId + " is deleted!");
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with ID " + taskId + " in project " + projectId + " not found. Cannot delete non-existent task!");
        }
    }

    @GetMapping(path = "/task/{taskId}/assignedusers")
    public ResponseEntity<?> getTaskAssignedUsers(
            @PathVariable("taskId") Long taskId
    ) {
        try {
            Task task = taskService.getTaskById(taskId);
            Set<User> assignedUsers = task.getAssignedUsers();
            return ResponseEntity.status(HttpStatus.OK).body(assignedUsers);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with ID " + taskId + " does not exist!");
        }
    }
}
