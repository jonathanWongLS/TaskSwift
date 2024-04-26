package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.request.RegisteredAndUnregisteredUsers;
import com.ts.taskswift.model.entities.User;
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

    /**
     * Loads a user by their username for Spring Security authentication.
     *
     * @param username The username to load.
     * @return UserDetails object representing the loaded user.
     * @throws UsernameNotFoundException If the username is not found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found!"));
    }

    /**
     * Loads a user by their ID.
     *
     * @param userId The ID of the user to load.
     * @return UserDetails object representing the loaded user.
     * @throws ResourceNotFoundException If the user with the given ID is not found.
     */
    public UserDetails loadUserById(Long userId) {
        return repository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " does not exist!"));
    }

    /**
     * Loads multiple users by their IDs.
     *
     * @param userIds The list of user IDs to load.
     * @return A set of UserDetails objects representing the loaded users.
     */
    public Set<User> loadUsersById(List<Long> userIds) {
        return new HashSet<>(repository.findAllById(userIds));
    }

    /**
     * Loads users by their email addresses, returning a mix of registered and unregistered users.
     *
     * @param userEmails The list of user email addresses to load.
     * @return An object containing sets of registered users and unregistered emails.
     */
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
