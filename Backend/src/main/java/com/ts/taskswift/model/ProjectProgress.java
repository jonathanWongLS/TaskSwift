package com.ts.taskswift.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectProgress {
    private Set<Project> project;
    private int numberOfTodoTasks;
    private int numberOfInProgressTasks;
    private int numberOfDoneTasks;
}
