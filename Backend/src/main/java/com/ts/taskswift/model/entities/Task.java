package com.ts.taskswift.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ts.taskswift.model.enums.Priority;
import com.ts.taskswift.model.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "task")
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "name", nullable = false)
    private String taskName;

    @Column(name = "description", nullable = false)
    private String taskDescription;

    @Column(name = "timeline_startdatetime", nullable = false)
    private String taskTimelineStartDateTime;

    @Column(name = "timeline_enddatetime", nullable = false)
    private String taskTimelineEndDateTime;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status taskStatus;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority taskPriority;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnore
    private Project project;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_task",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers = new HashSet<>();
}
