package com.softwareengineering9.toeicVoca.dto;


import com.softwareengineering9.toeicVoca.Entity.Users;

public class UserForm {
    private String email;
    private String name;
    private String id;
    private String password;

    public Users toEntity(){
        return new Users(email, name, id, password);
    }
}
