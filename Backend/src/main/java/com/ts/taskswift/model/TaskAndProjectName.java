package com.ts.taskswift.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TaskAndProjectName {
    private Task task;
    private String projectName;
}
