package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.Entity.Voca;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import com.softwareengineering9.toeicVoca.repository.VocaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LearnVocaController {
    @Autowired
    private VocaRepository vocaRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/learn/today")
    public List<Voca> getTodayVoca(@AuthenticationPrincipal UserDetails userDetails){
        Users user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));;
        int learningDate = user.getLearningDate();
        int vocaSize = 40;

        Pageable pageable = PageRequest.of(learningDate, vocaSize); // 1일에 40개의 단어
        return vocaRepository.findAll(pageable).getContent(); //voca table에서 40개의 단어 가져옴(learningData 기준)
    }
    @PostMapping("/learn/increase")
    public String increaseLearningDate(@AuthenticationPrincipal UserDetails userDetails) {
        Users user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        user.setLearningDate(user.getLearningDate() + 1);
        userRepository.save(user);  // 변경된 값을 저장

        return "학습 데이터가 1 증가했습니다.";
    }
}
