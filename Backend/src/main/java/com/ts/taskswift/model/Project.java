package com.ts.taskswift.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "project")
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "name", nullable = false)
    private String projectName;

    @Column(name = "description", nullable = false)
    private String projectDescription;

    @Column(name = "timeline_startdate", nullable = false)
    private Date projectTimelineStartDate;

    @Column(name = "timeline_enddate", nullable = false)
    private Date projectTimelineEndDate;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Task> tasks;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_project",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers = new HashSet<>();
}
