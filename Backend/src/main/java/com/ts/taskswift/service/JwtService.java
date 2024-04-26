package com.ts.taskswift.service;

import com.ts.taskswift.model.entities.Token;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final String SECRET_KEY = "<SECRET_KEY>";
    private final TokenRepository tokenRepository;

    /**
     * Extracts the username from the JWT token.
     *
     * @param token the JWT token
     * @return the username extracted from the token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Checks if the JWT token is valid for the given user.
     *
     * @param token the JWT token
     * @param user  the UserDetails object representing the user
     * @return true if the token is valid for the user, false otherwise
     */
    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);
        Token tokenExists = tokenRepository.findByToken(token).orElse(null);
        return (username.equals(user.getUsername())) && !isTokenExpired(token) && tokenExists != null;
    }

    /**
     * Checks if the JWT token is expired.
     *
     * @param token the JWT token
     * @return true if the token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date from the JWT token.
     *
     * @param token the JWT token
     * @return the expiration date extracted from the token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from the JWT token using a resolver function.
     *
     * @param token    the JWT token
     * @param resolver the resolver function for extracting the claim
     * @param <T>      the type of the extracted claim
     * @return the extracted claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /**
     * Extracts all claims from the JWT token.
     *
     * @param token the JWT token
     * @return the extracted claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Generates a JWT token for the given user.
     *
     * @param user the user object
     * @return the generated JWT token
     */
    public String generateToken(User user) {
         return Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(getSigninKey())
                .compact();
    }

    /**
     * Gets the sign in key used for JWT token verification.
     *
     * @return the signing key
     */
    public SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
