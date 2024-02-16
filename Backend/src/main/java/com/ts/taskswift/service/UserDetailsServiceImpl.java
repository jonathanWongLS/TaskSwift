package com.ts.taskswift.service;

import com.ts.taskswift.exception.EmailNotFoundException;
import com.ts.taskswift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository repository;
    @Override
    public UserDetails loadUserByUsername(String email) throws EmailNotFoundException {
        return repository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException("Username not found!"));
    }
}
