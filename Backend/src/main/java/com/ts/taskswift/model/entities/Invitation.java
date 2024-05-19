package com.ts.taskswift.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "invitation")
@Getter
@Setter
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "invitation_id")
    private Long id;

    @Column(name = "invitee_email")
    private String inviteeEmail;

    @Column(name = "token")
    private UUID invitationToken;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
