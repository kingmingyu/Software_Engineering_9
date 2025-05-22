package com.softwareengineering9.toeicVoca.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
public class Users implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    @Column
    private String name;
    @Column(unique = true)
    private String username; //id
    @Column
    private String password;
    @Column
    private Integer learningDate;

    public Users(String email, String name, String username, String password, Integer learningDate) {
        this.email = email;
        this.name = name;
        this.username = username;
        this.password = password;
        this.learningDate = learningDate;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한이 여러 개일 수 있지만, 지금은 하나만 예시
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return username; // 또는 email 등 로그인 기준에 따라 다르게
    }


}
