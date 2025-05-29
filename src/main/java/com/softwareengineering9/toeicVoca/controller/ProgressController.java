package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @GetMapping("/{username}")
    public ResponseEntity<List<String>> getProgress(@PathVariable String username) throws IOException {
        return ResponseEntity.ok(progressService.getCompletedDates(username));
    }

    @PostMapping("/{username}")
    public ResponseEntity<Void> addProgress(@PathVariable String username, @RequestBody Map<String, String> request) throws IOException {

        System.out.println("POST 요청 username: "+username);
        String data = request.get("data");
        System.out.println("POST 요청 data: "+data);
        progressService.addCompletedDates(username, data);
        return ResponseEntity.ok().build();
    }
}

