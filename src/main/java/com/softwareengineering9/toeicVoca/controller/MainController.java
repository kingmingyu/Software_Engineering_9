package com.softwareengineering9.toeicVoca.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MainController {
    @GetMapping("/admin")
    public ResponseEntity api2(){
        return new ResponseEntity<>("관리자화면 입니다.", HttpStatus.OK);
    }

    @GetMapping("/main")
    public ResponseEntity getMainPage(@AuthenticationPrincipal UserDetails userDetails){
        return new ResponseEntity<>(userDetails.getUsername(), HttpStatus.OK);
    }
}
