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
import java.time.LocalDate;
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
        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task with ID " + taskId + " not found!"
                        )
                );
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

        LocalDate now = LocalDate.now(ZoneId.of("Asia/Kuala_Lumpur"));

        for (Task task: user.getAssignedTasks()) {
            if (task.getTaskStatus() == Status.DONE) {
                taskCountByStatus[1]++;
            }
            else {
                if (LocalDate.parse(task.getTaskTimelineEndDateTime()).isBefore(now)) {
                    taskCountByStatus[2]++;
                }
                else {
                    taskCountByStatus[0]++;
                }
            }
        }
        return taskCountByStatus;
    }

    public List<TaskAndProjectName> getTasksOrderedByDatetimeDesc(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        List<TaskAndProjectName> assignedTasksAndProjectName = new ArrayList<>();
        Set<Task> assignedTasks = user.getAssignedTasks();
        List<Task> assignedTasksList = new ArrayList<>(assignedTasks);

        assignedTasksList.sort(Comparator.comparing(o -> LocalDate.parse(o.getTaskTimelineEndDateTime())));

        for (Task assignedTask: assignedTasksList) {
            assignedTasksAndProjectName.add(new TaskAndProjectName(assignedTask, assignedTask.getProject().getProjectName()));
        }

        return assignedTasksAndProjectName;
    }

    public List<TaskAndProjectName> getPriorityTasks(String authorizationHeader) {
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        LocalDate now = LocalDate.now(ZoneId.of("Asia/Kuala_Lumpur"));

        Set<Task> assignedTasks = user.getAssignedTasks();

        Iterator<Task> iterator = assignedTasks.iterator();
        while (iterator.hasNext()) {
            Task task = iterator.next();
            LocalDate taskEndDate = LocalDate.parse(task.getTaskTimelineEndDateTime());
            if (!(taskEndDate.compareTo(now) > 0 && taskEndDate.compareTo(now.plusDays(7)) <= 0)) {
                iterator.remove();
            }
        }

        List<Task> assignedTasksList = new ArrayList<>(assignedTasks);
        List<TaskAndProjectName> assignedTasksAndProjectNameList = new ArrayList<>();
        assignedTasksList.sort(Comparator.comparing(o -> LocalDate.parse(o.getTaskTimelineEndDateTime())));

        for (Task task: assignedTasksList) {
            assignedTasksAndProjectNameList.add(new TaskAndProjectName(task, task.getProject().getProjectName()));
        }

        return assignedTasksAndProjectNameList;
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
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot update non-existent task!"));

        if (updatedTaskRequest.getTaskToAdd().getTaskName() != null)
            taskToUpdate.setTaskName(updatedTaskRequest.getTaskToAdd().getTaskName());

        if (updatedTaskRequest.getTaskToAdd().getTaskDescription() != null)
            taskToUpdate.setTaskDescription(updatedTaskRequest.getTaskToAdd().getTaskDescription());

        if (updatedTaskRequest.getTaskToAdd().getTaskTimelineStartDateTime() != null)
            taskToUpdate.setTaskTimelineStartDateTime(updatedTaskRequest.getTaskToAdd().getTaskTimelineStartDateTime());

        if (updatedTaskRequest.getTaskToAdd().getTaskTimelineEndDateTime() != null)
            taskToUpdate.setTaskTimelineEndDateTime(updatedTaskRequest.getTaskToAdd().getTaskTimelineEndDateTime());

        if (updatedTaskRequest.getTaskToAdd().getTaskStatus() != null)
            taskToUpdate.setTaskStatus(updatedTaskRequest.getTaskToAdd().getTaskStatus());

        if (updatedTaskRequest.getTaskToAdd().getTaskPriority() != null)
            taskToUpdate.setTaskPriority(updatedTaskRequest.getTaskToAdd().getTaskPriority());

        if (updatedTaskRequest.getTaskToAdd().getAssignedUsers() != null)
            taskToUpdate.setAssignedUsers(
                    new HashSet<>(userDetailsService.loadUsersById(updatedTaskRequest.getAssignedUsersIdList()))
            );

        return taskRepository.save(taskToUpdate);
    }

    public void deleteTaskInProject(Long projectId, Long taskId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));
        for (Task task: project.getTasks()) {
            if (Objects.equals(task.getTaskId(), taskId)) {
                Set<User> assignedUsers = task.getAssignedUsers();
                assignedUsers.forEach(
                        user -> {
                            user.getAssignedTasks().remove(task);
                            userRepository.save(user);
                        });
                project.getTasks().remove(task);
                taskRepository.delete(task);
                return;
            }
        }
        throw new TaskNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot delete non-existent task!");
    }
}
