package com.ts.taskswift.repository;

import com.ts.taskswift.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByInvitationToken(UUID token);
}
