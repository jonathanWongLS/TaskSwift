package com.ts.taskswift.service;

import com.ts.taskswift.exception.UsernameAlreadyExistsException;
import com.ts.taskswift.exception.PasswordNotFoundException;
import com.ts.taskswift.model.request.AuthenticationResponse;
import com.ts.taskswift.model.entities.Token;
import com.ts.taskswift.model.entities.User;
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

    /**
     * Registers a new user.
     *
     * @param request the user details for registration
     * @return an authentication response containing the JWT token
     * @throws IllegalArgumentException       if one or more required values are not found in the JSON request
     * @throws UsernameAlreadyExistsException if a user with the same username already exists
     */
    public AuthenticationResponse register(User request) {
        // Check if all required values are present in the request for registration
        if (request.getUsername() == null || request.getEmail() == null || request.getPassword() == null || request.getRole() == null) {
            throw new IllegalArgumentException("One or more register values not found in JSON request!");
        }

        // Check if a user with the same username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("User with that username already exists!");
        }

        // Create a new user entity and encode the password
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user = userRepository.save(user);

        // Generate a JWT token for the user
        String token = jwtService.generateToken(user);

        // Save the token associated with the user
        Token tokenToSave = new Token();
        tokenToSave.setUser(user);
        tokenToSave.setToken(token);
        tokenRepository.save(tokenToSave);

        // Return the authentication response containing the JWT token
        return new AuthenticationResponse(token);
    }

    /**
     * Authenticates a user.
     *
     * @param request the user credentials for authentication
     * @return an authentication response containing the JWT token
     * @throws PasswordNotFoundException    if the password does not match
     * @throws UsernameNotFoundException   if the username is not found
     */
    public AuthenticationResponse authenticate(User request) {

        // Perform authentication using Spring Security's AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Retrieve the user details from the database
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found while authenticating!"));

        // Check if the provided password matches the encoded password in the database
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            // Generate a new JWT token for the authenticated user
            String token = jwtService.generateToken(user);

            // Revoke all existing tokens associated with the user
            revokeAllTokenByUser(user);

            // Save the new token associated with the user
            saveUserToken(user, token);

            // Return the authentication response containing the JWT token
            return new AuthenticationResponse(token);
        }
        else {
            // Throw an exception if the password does not match
            throw new PasswordNotFoundException("Password does not match!");
        }
    }

    /**
     * Saves a token associated with a user.
     *
     * @param user  the user entity
     * @param token the JWT token
     */
    private void saveUserToken(User user, String token) {
        Token tokenToSave = new Token();
        tokenToSave.setToken(token);
        tokenToSave.setUser(user);
        tokenRepository.save(tokenToSave);
    }

    /**
     * Revokes all tokens associated with a user.
     *
     * @param user the user entity
     */
    private void revokeAllTokenByUser(User user) {
        List<Token> validTokenListByUser = tokenRepository.findAllTokenByUser(user.getId());
        if (!validTokenListByUser.isEmpty()) {
            validTokenListByUser.forEach(tokenRepository::delete);
        }
    }
}
