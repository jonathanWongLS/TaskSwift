package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
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
}
