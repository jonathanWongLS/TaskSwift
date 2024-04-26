package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProjectTaskSummary {
    private Project project;
    private Integer numberOfNonDoneTasks;
    private Integer numberOfTasks;
}
