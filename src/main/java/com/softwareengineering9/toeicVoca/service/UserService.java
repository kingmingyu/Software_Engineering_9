package com.softwareengineering9.toeicVoca.service;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.dto.UserForm;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Users signup(UserForm dto) {
        Users users = dto.toEntity();
        if(users.getId() != null) { return null; }
        return userRepository.save(users);
    }
}
