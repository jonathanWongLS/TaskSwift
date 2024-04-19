package com.ts.taskswift.service;

import com.ts.taskswift.exception.UsernameAlreadyExistsException;
import com.ts.taskswift.exception.PasswordNotFoundException;
import com.ts.taskswift.model.AuthenticationResponse;
import com.ts.taskswift.model.Token;
import com.ts.taskswift.model.User;
import com.ts.taskswift.repository.TokenRepository;
import com.ts.taskswift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    public AuthenticationResponse register(User request) {
        if (request.getUsername() == null || request.getEmail() == null || request.getPassword() == null || request.getRole() == null) {
            throw new IllegalArgumentException("One or more register values not found in JSON request!");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("User with that username already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user = userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(User request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found while authenticating!"));
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user);
            revokeAllTokenByUser(user);
            saveUserToken(user, token);
            return new AuthenticationResponse(token);
        }
        else {
            throw new PasswordNotFoundException("Password does not match!");
        }
    }

    private void saveUserToken(User user, String token) {
        Token tokenToSave = new Token();
        tokenToSave.setToken(token);
        tokenToSave.setUser(user);
        tokenRepository.save(tokenToSave);
    }

    private void revokeAllTokenByUser(User user) {
        List<Token> validTokenListByUser = tokenRepository.findAllTokenByUser(user.getId());
        if (!validTokenListByUser.isEmpty()) {
            validTokenListByUser.forEach(tokenRepository::delete);
        }
    }
}
