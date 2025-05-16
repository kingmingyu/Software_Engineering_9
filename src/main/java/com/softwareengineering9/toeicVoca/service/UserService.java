package com.softwareengineering9.toeicVoca.service;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.dto.UserForm;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public Users signup(UserForm dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        Users users = dto.toEntity();
        if(users.getId() != null) { return null; }
        return userRepository.save(users);
    }

    @Transactional
    public void deleteByUsername(String username) {
        userRepository.deleteByUsername(username);
    }
}
