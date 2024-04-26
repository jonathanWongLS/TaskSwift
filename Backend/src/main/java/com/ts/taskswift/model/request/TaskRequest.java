package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.Task;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskRequest {
    private Task taskToAdd;
    private List<Long> assignedUsersIdList;
}
