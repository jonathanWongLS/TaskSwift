package com.ts.taskswift.filter;

import com.ts.taskswift.service.JwtService;
import com.ts.taskswift.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Performs authentication using JWT token.
     *
     * @param request     HttpServletRequest object
     * @param response    HttpServletResponse object
     * @param filterChain FilterChain object
     * @throws ServletException if servlet exception occurs
     * @throws IOException      if I/O exception occurs
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Get JWT token from Request Header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract username from JWT token which starts with "Bearer <JWT token here>"
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Get details of current user with their username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // If details in JWT token matches user's details
            if (jwtService.isValid(token, userDetails)) {
                // Authenticate user to access allowed API endpoints
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request, response);
        }
    }
}
