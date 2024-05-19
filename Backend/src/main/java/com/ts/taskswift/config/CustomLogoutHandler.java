package com.ts.taskswift.config;

import com.ts.taskswift.model.entities.Token;
import com.ts.taskswift.repository.TokenRepository;
import com.ts.taskswift.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {
    private final TokenRepository tokenRepository;

    /**
     * Handles logout by removing the token from the database.
     *
     * @param request        the HTTP servlet request
     * @param response       the HTTP servlet response
     * @param authentication the current authentication
     */
    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
    {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String token = authHeader.substring(7);

        // Get stored token from DB
        Token storedToken = tokenRepository.findByToken(token).orElse(null);

        // Remove the token
        if (storedToken != null) {
            tokenRepository.delete(storedToken);
        }
    }
}
