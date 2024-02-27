package com.ts.taskswift.repository;

import com.ts.taskswift.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId")
    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId AND t.taskId = :taskId")
    Task findByTaskIdAndProjectId(Long taskId, Long projectId);
}
