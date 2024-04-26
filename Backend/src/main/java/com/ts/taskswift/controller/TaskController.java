package com.ts.taskswift.controller;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.request.TaskAndProjectName;
import com.ts.taskswift.model.request.TaskRequest;
import com.ts.taskswift.model.entities.Task;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.service.TaskService;
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
public class TaskController {

    private final TaskService taskService;

    /**
     * Endpoint for retrieving a task by its ID.
     *
     * @param taskId [Path Variable] the ID of the task to retrieve
     * @return ResponseEntity with status 200 and the task with the specified ID if successful, or status 404 if the task is not found
     */
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

    /**
     * Endpoint for retrieving tasks belonging to a specific project.
     *
     * @param projectId [Path Variable] the ID of the project to retrieve tasks from
     * @return ResponseEntity with status 200 and a list of tasks belonging to the specified project if successful, or status 404 if the project is not found
     */
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

    /**
     * Endpoint for retrieving a task from a specific project by the task's and project's ID.
     *
     * @param projectId [Path Variable] the ID of the project containing the task
     * @param taskId    [Path Variable] the ID of the task to retrieve
     * @return ResponseEntity with status 200 and the task with the specified ID from the specified project if successful, or status 404 if the task or project is not found
     */
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

    /**
     * Endpoint for retrieving the count of tasks by their status assigned to the authenticated user.
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and an array representing the count of tasks by their status if successful, or status 404 if the user is not found
     */
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

    /**
     * Endpoint for retrieving tasks ordered by date in descending order.
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and a list of tasks ordered by datetime in descending order if successful, or status 404 if the user is not found
     */
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

    /**
     * Endpoint for retrieving tasks with higher priority (tasks with deadlines at most 7 days away).
     *
     * @param authorizationHeader the authorization header containing the JWT token
     * @return ResponseEntity with status 200 and a list of priority tasks if successful, or status 404 if the user is not found
     */
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

    /**
     * Endpoint for adding a task to a project.
     *
     * @param projectId            [Path Variable] the ID of the project to add the task to
     * @param addTaskToProjectRequest [Request Body] the request containing details of the task to add
     * @return ResponseEntity with status 200 and the added task if successful, or status 404 if the project is not found
     */
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

    /**
     * Endpoint for updating a task in a project.
     *
     * @param projectId           [Path Variable] the ID of the project containing the task to update
     * @param taskId              [Path Variable] the ID of the task to update
     * @param updatedTaskRequest [Request Body] the request containing updated details of the task
     * @return ResponseEntity with status 200 and the updated project if successful, or status 404 if the project or task is not found
     */
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

    /**
     * Endpoint for deleting a task in a project.
     *
     * @param projectId [Path Variable] the ID of the project containing the task to delete
     * @param taskId    [Path Variable] the ID of the task to delete
     * @return ResponseEntity with status 200 if successful, or status 404 if the project or task is not found
     */
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

    /**
     * Endpoint for retrieving users assigned to a task.
     *
     * @param taskId [Path Variable] the ID of the task to retrieve assigned users
     * @return ResponseEntity with status 200 and a set of users assigned to the task if successful, or status 404 if the task is not found
     */
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
