package com.softwareengineering9.toeicVoca.service;

import jakarta.annotation.PostConstruct; // 이걸 꼭 import 해주세요
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softwareengineering9.toeicVoca.domain.ProgressData;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {

    @Value("${progress.data.path}")
    private String basePath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ 애플리케이션 시작 시 폴더가 없으면 생성
    @PostConstruct
    public void init() {
        File directory = new File(basePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    private File getFile(String username) {
        return new File(basePath + username + ".json");
    }

    public List<String> getCompletedDates(String username) throws IOException {
        File file = getFile(username);
        if (!file.exists()) return new ArrayList<>();
        ProgressData data = objectMapper.readValue(file, ProgressData.class);
        return data.getCompletedDates();
    }

    public void addCompletedDates(String username, String date) throws IOException {
        List<String> dates = getCompletedDates(username);
        if (!dates.contains(date)) {
            dates.add(date);
            objectMapper.writeValue(getFile(username), new ProgressData(dates));
        }
    }
}