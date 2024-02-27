package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.Project;
import com.ts.taskswift.model.Task;
import com.ts.taskswift.repository.ProjectRepository;
import com.ts.taskswift.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public Task getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task with ID " + taskId + " not found!"
                        )
                );
        return task;
    }

    public List<Task> getTasksFromProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks == null) {
            throw new ResourceNotFoundException("Attempted to find tasks from project with ID " + projectId + " returned null");
        }
        return tasks;
    }

    public Task getTaskFromProject(Long taskId, Long projectId) {
        Task task = taskRepository.findByTaskIdAndProjectId(taskId, projectId);
        if (task == null) {
            throw new ResourceNotFoundException("Task with ID " + taskId + " does not exist in project with ID " + projectId + "!");
        }
        return task;
    }

    @Transactional
    public Task addTaskToProject(Long projectId, Task taskToAdd) {
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project with ID " + projectId + " not found. Cannot update non-existent project!"
                        )
                );
        taskToAdd.setProject(project);
        return taskRepository.save(taskToAdd);
    }

    @Transactional
    public Task updateTaskInProject(Long projectId, Long taskId, Task updatedTask) {
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
