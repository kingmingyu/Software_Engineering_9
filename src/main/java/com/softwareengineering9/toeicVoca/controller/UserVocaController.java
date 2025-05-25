package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.Entity.UserVoca;
import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.dto.UserVocaForm;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import com.softwareengineering9.toeicVoca.repository.UserVocaRepository;
import com.softwareengineering9.toeicVoca.service.UserService;
import com.softwareengineering9.toeicVoca.service.UserVocaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserVocaController {
    @Autowired
    private UserVocaService userVocaService;
    @Autowired
    private UserVocaRepository userVocaRepository;

    @PostMapping("/user-voca")
    public ResponseEntity<?> save(@RequestBody UserVocaForm dto,
                                  @AuthenticationPrincipal Users user) {
        try {
            UserVocaForm saved = userVocaService.saveWithUser(dto, user);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // ✅ 409로 보냄
        }
    }
    @GetMapping("/user-voca")
    public ResponseEntity<List<UserVocaForm>> getMyVocas(@AuthenticationPrincipal Users user) {
        List<UserVoca> vocas = userVocaRepository.findAllByUsers(user);
        List<UserVocaForm> result = vocas.stream()
                .map(UserVoca::createUserVoca)
                .toList();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/user-voca/{id}")
    public ResponseEntity<?> deleteUserVoca(@PathVariable Long id, @AuthenticationPrincipal Users user) {
        UserVoca voca = userVocaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다."));

        if (!voca.getUsers().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("삭제 권한 없음");
        }

        userVocaRepository.delete(voca);
        return ResponseEntity.ok().build();
    }
}
