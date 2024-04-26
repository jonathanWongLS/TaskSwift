package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectProgress {
    private Project project;
    private int numberOfTodoTasks;
    private int numberOfInProgressTasks;
    private int numberOfDoneTasks;
}
