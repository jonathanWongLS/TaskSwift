package com.ts.taskswift.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GenerateInviteTokenRequest {
    private Long projectId;
    private String inviteeEmail;
}
