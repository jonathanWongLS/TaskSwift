package com.ts.taskswift.repository;

import com.ts.taskswift.model.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    /**
     * Find token(s) assigned to a user by that user's ID
     *
     * @param userId the user ID the token(s) may be assigned to
     * @return List of tokens assigned to the user with user ID
     */
    @Query("Select t from Token t inner join User u on t.user.id = u.id where t.user.id = :userId")
    List<Token> findAllTokenByUser(Long userId);

    /**
     * Find a token by its value
     *
     * @param token the token to find
     * @return an Optional containing the token if found, otherwise empty
     */
    Optional<Token> findByToken(String token);
}
