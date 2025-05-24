package com.softwareengineering9.toeicVoca.repository;

import com.softwareengineering9.toeicVoca.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long>{

    Optional<Users> findByUsername(String username);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    void deleteByUsername(String username);

    Optional<Users> findByNameAndEmail(String name, String email);
    Optional<Users> findByNameAndUsername(String name, String username);
}
