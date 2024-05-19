package com.ts.taskswift.model.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@JsonIdentityInfo(generator= ObjectIdGenerators.UUIDGenerator.class, property="projectId")
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

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Task> tasks;

    @ManyToMany
    @JoinTable(
            name = "user_project",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers = new HashSet<>();

    @Column(name = "project_invitations")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project")
    private Set<Invitation> invitations;
}
