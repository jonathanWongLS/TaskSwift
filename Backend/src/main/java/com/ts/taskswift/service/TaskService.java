package com.ts.taskswift.service;

import com.ts.taskswift.exception.ProjectNotFoundException;
import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.exception.TaskNotFoundException;
import com.ts.taskswift.model.entities.Project;
import com.ts.taskswift.model.entities.Task;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.model.enums.Status;
import com.ts.taskswift.model.request.TaskAndProjectName;
import com.ts.taskswift.model.request.TaskRequest;
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

    /**
     * Retrieves a task by its ID.
     *
     * @param taskId The ID of the task to retrieve.
     * @return The task if found.
     * @throws TaskNotFoundException If no task with the given ID exists.
     */
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task with ID " + taskId + " not found!"
                        )
                );
    }

    /**
     * Retrieves all tasks associated with a project.
     *
     * @param projectId The ID of the project to retrieve tasks from.
     * @return The list of tasks associated with the project.
     * @throws TaskNotFoundException If no tasks are found for the given project ID.
     */
    public List<Task> getTasksFromProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks == null) {
            throw new TaskNotFoundException("Attempted to find tasks from project with ID " + projectId + " returned null");
        }
        return tasks;
    }

    /**
     * Retrieves a task from a specific project by task ID and project ID.
     *
     * @param taskId    The ID of the task to retrieve.
     * @param projectId The ID of the project containing the task.
     * @return The task from the project if found.
     * @throws TaskNotFoundException If the task with the given ID does not exist in the specified project.
     */
    public Task getTaskFromProject(Long taskId, Long projectId) {
        Task task = taskRepository.findByTaskIdAndProjectId(taskId, projectId);
        if (task == null) {
            throw new TaskNotFoundException("Task with ID " + taskId + " does not exist in project with ID " + projectId + "!");
        }
        return task;
    }

    /**
     * Retrieves the count of tasks grouped by their status for the current user.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return An array representing the count of tasks by status: [todoCount, inProgressCount, doneCount].
     */
    public int[] getTaskCountByStatus(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Get the LocalDate object at time of method execution
        LocalDate now = LocalDate.now(ZoneId.of("Asia/Kuala_Lumpur"));

        int[] taskCountByStatus = new int[3];
        for (Task task: user.getAssignedTasks()) {
            // Increment 2nd element in array if current task is completed with DONE status
            if (task.getTaskStatus() == Status.DONE) {
                taskCountByStatus[1]++;
            }
            else {
                // Increment 3rd element in array if current task is overdue
                if (LocalDate.parse(task.getTaskTimelineEndDateTime()).isBefore(now)) {
                    taskCountByStatus[2]++;
                }
                // Increment 1st element in array if current task is NOT overdue
                else {
                    taskCountByStatus[0]++;
                }
            }
        }
        return taskCountByStatus;
    }

    /**
     * Retrieves tasks ordered by their end date in descending order for the current user.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A list of tasks with project names ordered by end date in descending order.
     */
    public List<TaskAndProjectName> getTasksOrderedByDatetimeDesc(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        List<TaskAndProjectName> assignedTasksAndProjectName = new ArrayList<>();
        Set<Task> assignedTasks = user.getAssignedTasks();
        List<Task> assignedTasksList = new ArrayList<>(assignedTasks);

        // Sort tasks based on their deadlines in descending order
        assignedTasksList.sort(Comparator.comparing(o -> LocalDate.parse(o.getTaskTimelineEndDateTime())));

        // Add sorted tasks and their associated project to a list
        for (Task assignedTask: assignedTasksList) {
            assignedTasksAndProjectName.add(new TaskAndProjectName(assignedTask, assignedTask.getProject().getProjectName()));
        }

        return assignedTasksAndProjectName;
    }

    /**
     * Retrieves priority tasks for the current user.
     *
     * @param authorizationHeader The authorization header containing the JWT token.
     * @return A list of priority tasks for the current user.
     */
    public List<TaskAndProjectName> getPriorityTasks(String authorizationHeader) {

        // Extract user details
        String jwtToken = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        User user = (User) userDetailsService.loadUserByUsername(username);

        // Get the LocalDate object at time of method execution
        LocalDate now = LocalDate.now(ZoneId.of("Asia/Kuala_Lumpur"));

        // Get tasks assigned to user
        Set<Task> assignedTasks = user.getAssignedTasks();

        // Remove task from the list of copied over tasks with deadlines with more than 7 days to go
        Iterator<Task> iterator = assignedTasks.iterator();
        while (iterator.hasNext()) {
            Task task = iterator.next();
            LocalDate taskEndDate = LocalDate.parse(task.getTaskTimelineEndDateTime());
            if (!(taskEndDate.isAfter(now) && !taskEndDate.isAfter(now.plusDays(7)))) {
                iterator.remove();
            }
        }

        // Add set of assigned tasks to an arraylist and sort by their deadlines
        List<Task> assignedTasksList = new ArrayList<>(assignedTasks);
        assignedTasksList.sort(Comparator.comparing(o -> LocalDate.parse(o.getTaskTimelineEndDateTime())));

        // Add the tasks and their associated project names to ArrayList assignedTasksAndProjectNameList
        List<TaskAndProjectName> assignedTasksAndProjectNameList = new ArrayList<>();
        for (Task task: assignedTasksList) {
            assignedTasksAndProjectNameList.add(new TaskAndProjectName(task, task.getProject().getProjectName()));
        }

        return assignedTasksAndProjectNameList;
    }

    /**
     * Adds a task to a project.
     *
     * @param projectId               The ID of the project to which the task will be added.
     * @param addTaskToProjectRequest The request containing the task information.
     * @return The added task.
     */
    public Task addTaskToProject(Long projectId, TaskRequest addTaskToProjectRequest) {
        // Retrieve the project by its ID
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project with ID " + projectId + " not found. Cannot update non-existent project!"
                        )
                );

        // Create a set to store assigned users for the task
        Set<User> assignedUsers = new HashSet<>();

        // Populate assigned users from the request
        addTaskToProjectRequest.getAssignedUsersIdList().forEach(userId -> {
                    try {
                        User user = (User) userDetailsService.loadUserById(userId);
                        assignedUsers.add(user);
                    } catch (ResourceNotFoundException ignored) {}
                }
        );

        // Set assigned users and project for the task
        Task taskToAdd = addTaskToProjectRequest.getTaskToAdd();
        taskToAdd.setAssignedUsers(assignedUsers);
        taskToAdd.setProject(project);

        // Save and return the added task
        return taskRepository.save(taskToAdd);
    }

    /**
     * Updates a task in a project.
     *
     * @param projectId           The ID of the project containing the task.
     * @param taskId              The ID of the task to be updated.
     * @param updatedTaskRequest  The request containing the updated task information.
     * @return The updated task.
     */
    public Task updateTaskInProject(Long projectId, Long taskId, TaskRequest updatedTaskRequest) {
        // Retrieve tasks in the project by project ID
        List<Task> tasksInProject = taskRepository.findByProjectId(projectId);

        // Find the task to update by task ID
        Task taskToUpdate = tasksInProject
                .stream()
                .filter(task -> task.getTaskId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot update non-existent task!"));

        // Update task details if provided in the request6
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

        // Save and return the updated task
        return taskRepository.save(taskToUpdate);
    }

    /**
     * Deletes a task from a project.
     *
     * @param projectId The ID of the project containing the task.
     * @param taskId    The ID of the task to be deleted.
     */
    public void deleteTaskInProject(Long projectId, Long taskId) {
        // Retrieve the project by ID or throw ProjectNotFoundException if not found
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist!"));

        // Iterate over the tasks in the project
        for (Task task: project.getTasks()) {
            // Check if the task ID matches the specified taskId
            if (Objects.equals(task.getTaskId(), taskId)) {

                // Retrieve the assigned users of the task
                Set<User> assignedUsers = task.getAssignedUsers();

                // Remove the task from the assigned tasks of each user
                assignedUsers.forEach(
                        user -> {
                            user.getAssignedTasks().remove(task);
                            userRepository.save(user);
                        });

                // Remove the task from the project's tasks
                project.getTasks().remove(task);

                // Delete the task from the repository
                taskRepository.delete(task);
                return;
            }
        }

        // If the task with the specified ID is not found in the project, throw TaskNotFoundException
        throw new TaskNotFoundException("Task with ID " + taskId + " in project " + projectId + " not found. Cannot delete non-existent task!");
    }
}
