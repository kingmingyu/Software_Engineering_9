package com.softwareengineering9.toeicVoca.service;

import com.softwareengineering9.toeicVoca.Entity.UserVoca;
import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.dto.UserVocaForm;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import com.softwareengineering9.toeicVoca.repository.UserVocaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserVocaService {
    @Autowired
    private UserVocaRepository userVocaRepository;
    @Autowired
    private UserRepository userRepository;



    public UserVocaForm saveWithUser(UserVocaForm dto, Users users) {
        boolean exists = userVocaRepository.existsByUsersAndSpelling(users, dto.getSpelling());
        if (exists) {
            throw new IllegalStateException("이미 저장된 단어입니다.");
        }

        UserVoca userVoca = dto.toEntity(users);
        userVocaRepository.save(userVoca);

        UserVoca saved = userVocaRepository.findByIdWithUser(userVoca.getId())
                .orElseThrow(() -> new IllegalStateException("저장 후 조회 실패"));

        return UserVoca.createUserVoca(saved);
    }
}
