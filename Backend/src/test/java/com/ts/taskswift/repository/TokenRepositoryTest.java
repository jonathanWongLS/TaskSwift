package com.ts.taskswift.repository;

import com.ts.taskswift.model.enums.Role;
import com.ts.taskswift.model.entities.Token;
import com.ts.taskswift.model.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@DataJpaTest
public class TokenRepositoryTest {
    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        tokenRepository.deleteAll();
    }

    /**
     * Test to verify that the TokenRepository can find all tokens associated with a user.
     *
     * @Setup: Create a new user and save it to the UserRepository. Generate a JWT token for the user and save it to the TokenRepository.
     * @Execution: Call the findAllTokenByUser method of the TokenRepository with the user's ID.
     * @Assertion: Verify that the method returns a list containing exactly one token, and that the token in the list matches the one saved earlier.
     */
    @Test
    void itShouldFindAllTokenByUser() {
        User user = new User();
        user.setUsername("Jack");
        user.setEmail("jack@gmail.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        String SECRET_KEY = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        token = tokenRepository.save(token);

        List<Token> userTokensFromDatabase = tokenRepository.findAllTokenByUser(user.getId());
        boolean userTokenExists = (userTokensFromDatabase.size() == 1) && (userTokensFromDatabase.get(0) == token);

        assertThat(userTokenExists).isTrue();
    }

    /**
     * Test to verify that the TokenRepository does not find any tokens associated with a user when the user has no tokens.
     *
     * @Setup: Create two users and save them to the UserRepository. Generate a JWT token for one user and save it to the TokenRepository.
     * @Execution: Call the findAllTokenByUser method of the TokenRepository with the ID of the other user.
     * @Assertion: Verify that the method returns an empty list, indicating that no tokens are associated with the other user.
     */
    @Test
    void itShouldNotFindAllTokenByUser() {
        User user = new User();
        user.setUsername("Jack");
        user.setEmail("jack@gmail.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        User otherUser = new User();
        otherUser.setUsername("OtherUser");
        otherUser.setEmail("otheruser@gmail.com");
        otherUser.setPassword("password");
        otherUser.setRole(Role.USER);
        otherUser.setAssignedProjects(new HashSet<>());
        otherUser.setAssignedTasks(new HashSet<>());
        otherUser = userRepository.save(otherUser);

        String SECRET_KEY_TEST = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY_TEST);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        token = tokenRepository.save(token);

        List<Token> userTokensFromDatabase = tokenRepository.findAllTokenByUser(otherUser.getId());
        boolean userTokenExists = (userTokensFromDatabase.size() == 1) && (userTokensFromDatabase.get(0) == token);

        assertThat(userTokenExists).isFalse();
    }
}
