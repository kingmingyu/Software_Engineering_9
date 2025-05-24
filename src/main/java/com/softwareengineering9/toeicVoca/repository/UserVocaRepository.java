package com.softwareengineering9.toeicVoca.repository;

import com.softwareengineering9.toeicVoca.Entity.UserVoca;
import com.softwareengineering9.toeicVoca.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserVocaRepository extends JpaRepository<UserVoca, Long> {
    @Query("SELECT uv FROM UserVoca uv JOIN FETCH uv.users WHERE uv.id = :id")
    Optional<UserVoca> findByIdWithUser(@Param("id") Long id);

    List<UserVoca> findAllByUsers(Users user);

    boolean existsByUsersAndSpelling(Users users, String spelling);
}
