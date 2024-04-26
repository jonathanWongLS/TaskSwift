package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.Task;
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
