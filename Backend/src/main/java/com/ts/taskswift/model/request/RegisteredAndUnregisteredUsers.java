package com.ts.taskswift.model.request;

import com.ts.taskswift.model.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class RegisteredAndUnregisteredUsers {
    private Set<User> registeredUserSet;
    private Set<String> unregisteredEmailSet;
}
