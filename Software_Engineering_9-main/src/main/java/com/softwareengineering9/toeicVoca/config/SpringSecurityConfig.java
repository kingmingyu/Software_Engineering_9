package com.softwareengineering9.toeicVoca.config;

import com.softwareengineering9.toeicVoca.Entity.Users;
import com.softwareengineering9.toeicVoca.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity(debug = true)
public class SpringSecurityConfig {
    @Autowired
    private UserRepository userRepository;
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return new WebSecurityCustomizer() {
            @Override
            public void customize(WebSecurity web) {
                web.ignoring()
                        .requestMatchers("/favicon.ico")
                        .requestMatchers("/error")
                        .requestMatchers(toH2Console());
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/login", "/signup", "/favicon.ico", "/static/**").permitAll()
                        .requestMatchers("/doLogin").permitAll()
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/signup").permitAll()
                        .requestMatchers("/main").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        .loginPage("/login")
                        .loginProcessingUrl("/doLogin")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/api/main")
                        .successHandler((request, response, authentication) -> {
                            System.out.println("로그인 성공: " + authentication.getName());
                            System.out.println("권한: " + authentication.getAuthorities());

                            // 관리자 계정 확인
                            if (authentication.getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                                System.out.println("관리자로 리다이렉트");
                                response.setHeader("location", "/admin");
                                response.setStatus(HttpServletResponse.SC_OK);
                            } else {
                                System.out.println("일반 사용자로 리다이렉트");
                                response.setHeader("location", "/main");
                                response.setStatus(HttpServletResponse.SC_OK);
                            }
                        })
                        .failureHandler((request, response, exception) -> {
                            System.out.println("로그인 실패: " + exception.getMessage());
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("로그인 실패");
                        })
                )
                //성공한 뒤 이동하는 페이지
                .rememberMe(rm -> rm.rememberMeParameter("remember")
                        .alwaysRemember(false)
                        .tokenValiditySeconds(2592000)
                )
                .userDetailsService(userDetailsService(userRepository))
                //csrf쪽으로는 builder가 이어지지 않기 때문에 and로 이어준다.
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                // 관리자 계정 체크
                if ("admin".equals(username)) {
                    System.out.println("관리자 계정 로그인 시도");
                    Users adminUser = new Users();
                    adminUser.setUsername("admin");
                    adminUser.setPassword("admin123");
                    adminUser.setRole("ADMIN");
                    return adminUser;
                }

                //일반 사용자 계정 체크
                try {
                    Users users = userRepository.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException(username + "을 찾을 수 없습니다."));
                    System.out.println("일반 사용자 로그인: " + username);
                    return users;
                } catch (Exception e) {
                    System.out.println("사용자 검색 오류: " + e.getMessage());
                    throw e;
                }
            }
        };
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(); //실전 사용
        return NoOpPasswordEncoder.getInstance(); // 평문으로 비교

    }

}
