package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import com.softwareengineering9.toeicVoca.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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
    public ResponseEntity<String> deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        userService.deleteByUsername(username);
        return ResponseEntity.ok("탈퇴 완료");
    }

    @PatchMapping("/myPage/edit")
    public ResponseEntity<?> updateUser(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody Map<String, String> updates,
                                        HttpServletRequest request,
                                        HttpServletResponse response) {
        String currentUsername = userDetails.getUsername();
        Users user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        boolean usernameChanged = false;

        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
            usernameChanged = true;
        }

        userRepository.save(user);

        // username을 바꿨다면 로그아웃 처리
        if (usernameChanged) {
            new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
            return ResponseEntity.ok("username 변경됨, 로그아웃되었습니다.");
        }

        return ResponseEntity.ok("수정 완료");
    }
}
