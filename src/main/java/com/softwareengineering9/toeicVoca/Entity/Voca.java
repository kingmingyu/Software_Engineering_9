package com.softwareengineering9.toeicVoca.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Entity
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Voca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String spelling;
    @Column
    private String meaning;

    public Voca(String spelling, String meaning) {
        this.spelling = spelling;
        this.meaning = meaning;
    }
}
