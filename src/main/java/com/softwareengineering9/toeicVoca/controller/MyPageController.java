package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import com.softwareengineering9.toeicVoca.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class MyPageController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @GetMapping("/myPage")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "username", user.getUsername()
        ));
    }

    @DeleteMapping("/user")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        userService.deleteByUsername(username);
        return ResponseEntity.ok("탈퇴 완료");
    }
//    @PatchMapping("/myPage/edit")
//    public
}
