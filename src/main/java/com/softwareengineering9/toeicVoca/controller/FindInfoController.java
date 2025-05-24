package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/find")
public class FindInfoController {
    @Autowired
    private UserService userService;

    @GetMapping("/username")
    public ResponseEntity<?> findUsername(@RequestParam String name, @RequestParam String email) {
        String username = userService.findUsernameByNameAndEmail(name, email);
        if (username != null) {
            return ResponseEntity.ok(java.util.Map.of("result", username));
        } else {
            return ResponseEntity.badRequest().body("일치하는 정보가 없습니다.");
        }
    }

    @GetMapping("/password")
    public ResponseEntity<?> findPassword(@RequestParam String name, @RequestParam String username) {
        String password = userService.findPasswordByNameAndUsername(name, username);
        if (password != null) {
            return ResponseEntity.ok(java.util.Map.of("result", password));
        } else {
            return ResponseEntity.badRequest().body("일치하는 정보가 없습니다.");
        }
    }
} 