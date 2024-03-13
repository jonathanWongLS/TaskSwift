package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.RegisteredAndUnregisteredUsers;
import com.ts.taskswift.model.User;
import com.ts.taskswift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository repository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found!"));
    }

    public UserDetails loadUserById(Long userId) {
        return repository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " does not exist!"));
    }

    public Set<User> loadUsersById(List<Long> userIds) {
        return new HashSet<>(repository.findAllById(userIds));
    }

    public User loadUserByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " does not exist!"));
    }

    public RegisteredAndUnregisteredUsers loadUsersByEmail(List<String> userEmails) {
        Set<User> registeredUsers = new HashSet<>();
        Set<String> unregisteredEmails = new HashSet<>();

        for (String userEmail : userEmails) {
            User user = repository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                registeredUsers.add(user);
            }
            else {
                unregisteredEmails.add(userEmail);
            }
        }

        RegisteredAndUnregisteredUsers registeredAndUnregisteredUsers = new RegisteredAndUnregisteredUsers(registeredUsers, unregisteredEmails);
        return registeredAndUnregisteredUsers;
    }
}
