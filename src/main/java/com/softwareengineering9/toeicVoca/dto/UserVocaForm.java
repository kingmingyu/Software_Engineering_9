package com.softwareengineering9.toeicVoca.dto;


import com.softwareengineering9.toeicVoca.Entity.UserVoca;
import com.softwareengineering9.toeicVoca.Entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserVocaForm {
    private Long id;
    private String spelling;
    private String meaning;
    private Long userId;

    public UserVoca toEntity(Users users){
        return new UserVoca(spelling, meaning, users);
    }
}
