package com.softwareengineering9.toeicVoca.dto;


import com.softwareengineering9.toeicVoca.Entity.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserForm {
    private String email;
    private String name;
    private String username;
    private String password;
    private Integer learningDate;

    public Users toEntity(){
        return new Users(email, name, username, password, 0);
    }
}
