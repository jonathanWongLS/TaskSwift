package com.ts.taskswift.service;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.exception.TaskNotFoundException;
import com.ts.taskswift.model.*;
import com.ts.taskswift.repository.ProjectRepository;
import com.ts.taskswift.repository.TaskRepository;
import com.ts.taskswift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    public Task getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task with ID " + taskId + " not found!"
                        )
                );
        return task;
    }

    public List<Task> getTasksFromProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks == null) {
            throw new TaskNotFoundException("Attempted to find tasks from project with ID " + projectId + " returned null");
        }
        return tasks;
    }

    public Task getTaskFromProject(Long taskId, Long projectId) {
        Task task = taskRepository.findByTaskIdAndProjectId(taskId, projectId);
        if (task == null) {
            throw new TaskNotFoundException("Task with ID " + taskId + " does not exist in project with ID " + projectId + "!");
        }
        return task;
    }

    public int[] getTaskCountByStatus(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);
        int[] taskCountByStatus = new int[3];

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedZoneDateTimeNow = formatter.format(ZonedDateTime.now(ZoneId.of("Asia/Kuala_Lumpur")));
        ZonedDateTime now = ZonedDateTime.parse(formattedZoneDateTimeNow, formatter);

        for (Task task: user.getAssignedTasks()) {
            if (task.getTaskStatus() == Status.DONE) {
                taskCountByStatus[1]++;
            }
            else {
                if (ZonedDateTime.parse(task.getTaskTimelineEndDateTime(), formatter).isBefore(now)) {
                    taskCountByStatus[0]++;
                }
                else {
                    taskCountByStatus[2]++;
                }
            }
        }
        return taskCountByStatus;
    }

    public List<Task> getTasksOrderedByDatetimeDesc(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        Set<Task> assignedTasks = user.getAssignedTasks();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        List<Task> assignedTasksList = new ArrayList<>();
        assignedTasksList.addAll(assignedTasks);

        Collections.sort(assignedTasksList, (o1, o2) -> ZonedDateTime.parse(o2.getTaskTimelineEndDateTime(), formatter).compareTo(ZonedDateTime.parse(o1.getTaskTimelineEndDateTime(), formatter)));
        return assignedTasksList;
    }

    public Task addTaskToProject(Long projectId, TaskRequest addTaskToProjectRequest) {
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project with ID " + projectId + " not found. Cannot update non-existent project!"
                        )
                );

        Set<User> assignedUsers = new HashSet<>();
        addTaskToProjectRequest.getAssignedUsersIdList().forEach(userId -> {
                    try {
                        User user = (User) userDetailsService.loadUserById(userId);
                        assignedUsers.add(user);
                    } catch (ResourceNotFoundException e) {}
                }
        );
        Task taskToAdd = addTaskToProjectRequest.getTaskToAdd();
        taskToAdd.setAssignedUsers(assignedUsers);
        taskToAdd.setProject(project);
        return taskRepository.save(taskToAdd);
    }

    public Task updateTaskInProject(Long projectId, Long taskId, TaskRequest updatedTaskRequest) {
        List<Task> tasksInProject = taskRepository.findByProjectId(projectId);

        Task taskToUpdate = tasksInProject
                .stream()
                .filter(task -> task.getTaskId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot update non-existent task!"));

        if (updatedTask.getTaskName() != null)
            taskToUpdate.setTaskName(updatedTask.getTaskName());

        if (updatedTask.getTaskDescription() != null)
            taskToUpdate.setTaskDescription(updatedTask.getTaskDescription());

        if (updatedTask.getTaskTimelineStartDate() != null)
            taskToUpdate.setTaskTimelineStartDate(updatedTask.getTaskTimelineStartDate());

        if (updatedTask.getTaskTimelineEndDate() != null)
            taskToUpdate.setTaskTimelineEndDate(updatedTask.getTaskTimelineEndDate());

        if (updatedTask.getTaskStatus() != null)
            taskToUpdate.setTaskStatus(updatedTask.getTaskStatus());

        if (updatedTask.getTaskPriority() != null)
            taskToUpdate.setTaskPriority(updatedTask.getTaskPriority());

        if (updatedTask.getAssignedUsers() != null)
            taskToUpdate.setAssignedUsers(updatedTask.getAssignedUsers());

        return taskRepository.save(taskToUpdate);
    }

    @Transactional
    public void deleteTaskInProject(Long projectId, Long taskId) {
        List<Task> tasksInProject = taskRepository.findByProjectId(projectId);

        Task taskToDelete = tasksInProject
                .stream()
                .filter(task -> task.getTaskId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot delete non-existent task!"));

        taskRepository.delete(taskToDelete);
    }
}
