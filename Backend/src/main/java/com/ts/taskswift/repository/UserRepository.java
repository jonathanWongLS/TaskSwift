package com.ts.taskswift.repository;

import com.ts.taskswift.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Find a user by username
     *
     * @param username the username to search for
     * @return an Optional containing the user if found, otherwise empty
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by email address
     *
     * @param email the email address to search for
     * @return an Optional containing the user if found, otherwise empty
     */
    Optional<User> findByEmail(String email);
}
