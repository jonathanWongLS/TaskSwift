package com.ts.taskswift.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CreateProjectRequest {
    private Project project;
    private List<String> assignedUserEmail;
}
