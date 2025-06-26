package com.example.clientauth.repository;

import com.example.clientauth.entity.User;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
    Optional<User> findByFirebaseUid(String firebaseUid);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :role")
    List<User> findUsersByRoleName(@Param("role") String roleName);
}
