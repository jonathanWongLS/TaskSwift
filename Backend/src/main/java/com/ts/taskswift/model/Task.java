package com.ts.taskswift.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
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

    @Column(name = "timeline_startdate", nullable = false)
    private Date taskTimelineStartDate;

    @Column(name = "timeline_enddate", nullable = false)
    private Date taskTimelineEndDate;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status taskStatus;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority taskPriority;

    @JsonIgnore
    @ManyToMany(mappedBy = "assignedTasks")
    private Set<User> assignedUsers = new HashSet<>();
}
