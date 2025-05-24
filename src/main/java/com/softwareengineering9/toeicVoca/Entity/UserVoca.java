package com.softwareengineering9.toeicVoca.Entity;

import com.softwareengineering9.toeicVoca.dto.UserVocaForm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserVoca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String spelling;
    @Column
    private String meaning;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    public UserVoca(String spelling, String meaning, Users users) {
        this.spelling = spelling;
        this.meaning = meaning;
        this.users = users;
    }

    public static UserVocaForm createUserVoca(UserVoca userVoca) {
        if (userVoca.getUsers() == null) {
            throw new IllegalStateException("User 정보가 없습니다.");
        }
        return new UserVocaForm(userVoca.getId(), userVoca.getSpelling(), userVoca.getMeaning(), userVoca.getUsers().getId());
    }
}
