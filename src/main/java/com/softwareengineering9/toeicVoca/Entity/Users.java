package com.softwareengineering9.toeicVoca.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
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
public class Users implements UserDetails{
    @Column
    private String email;
    @Column
    private String name;
    @Id
    private String id;
    @Column
    private String password;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한이 여러 개일 수 있지만, 지금은 하나만 예시
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return id; // 또는 email 등 로그인 기준에 따라 다르게
    }
}
