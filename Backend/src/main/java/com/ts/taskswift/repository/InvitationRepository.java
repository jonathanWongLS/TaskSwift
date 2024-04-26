package com.ts.taskswift.repository;

import com.ts.taskswift.model.entities.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    /**
     * Find an invitation by invitation token
     *
     * @param token the invitation token to search for
     * @return An Optional containing the Invitation if found, otherwise empty Optional
     */
    Optional<Invitation> findByInvitationToken(UUID token);
}
