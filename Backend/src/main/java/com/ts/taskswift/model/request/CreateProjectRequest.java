package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.Project;
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
