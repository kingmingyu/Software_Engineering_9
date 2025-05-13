package com.softwareengineering9.toeicVoca.repository;

import com.softwareengineering9.toeicVoca.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, String>{

}
