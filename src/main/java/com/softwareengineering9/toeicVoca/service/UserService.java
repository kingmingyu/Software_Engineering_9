package com.softwareengineering9.toeicVoca.service;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.dto.UserForm;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    //@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없음"));
        return user; // CustomUserDetails 말고 Users 엔티티 자체를 리턴
    }

    public String findUsernameByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email)
                .map(Users::getUsername)
                .orElse(null);
    }

    public String findPasswordByNameAndUsername(String name, String username) {
        return userRepository.findByNameAndUsername(name, username)
                .map(Users::getPassword)
                .orElse(null);
    }
}
