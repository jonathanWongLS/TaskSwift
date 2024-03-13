package com.ts.taskswift.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddAssignedUsersToProjectRequest {
    private Long projectId;
    private List<String> newAssignedUsersEmails;
}
