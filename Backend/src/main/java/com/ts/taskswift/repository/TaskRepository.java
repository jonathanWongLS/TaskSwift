package com.ts.taskswift.repository;

import com.ts.taskswift.model.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    /**
     * Find task(s) assigned to a project by that project's ID
     *
     * @param projectId the project ID the task(s) may be assigned to
     * @return List of tasks assigned to the project with project ID
     */
    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId")
    List<Task> findByProjectId(Long projectId);

    /**
     * Find a task by task ID and project ID
     *
     * @param taskId    the ID of the task to find
     * @param projectId the ID of the project the task belongs to
     * @return the task with the specified ID and project ID
     */
    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId AND t.taskId = :taskId")
    Task findByTaskIdAndProjectId(Long taskId, Long projectId);
}
