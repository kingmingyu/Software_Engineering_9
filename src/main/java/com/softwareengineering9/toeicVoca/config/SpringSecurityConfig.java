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
//                    .requestMatchers(HttpMethod.POST,"/auth/login").permitAll()
//                    .requestMatchers(HttpMethod.POST,"/auth/signup").permitAll()
                                //위의 방법을 사용하면 무한 페이지 리다이렉트 될 수 있다...?
                                .requestMatchers("/", "/index.html", "/login", "/signup", "/favicon.ico", "/static/**").permitAll()
                                .requestMatchers("/login").permitAll()
                                .requestMatchers("/signup").permitAll()
//                .requestMatchers("/user").hasRole("USER")
                                .requestMatchers("/api/main").hasRole("USER")
                                // 관리자는 사용자 페이지도 접근 가능해야 하기 때문에 hasAnyRole을 통해 여러 권한을 줄 수 있다.
                                .requestMatchers("/api/admin").hasRole("ADMIN")
                                //이건 일반적인 경우 사용
//                .requestMatchers("/admin").access(new WebExpressionAuthorizationManager("hasRole('ADMIN') AND hasAuthority('WRITE')"))
                                //역할과 권한을 둘 다 조건으로 줘야 할 때
                                //hasRole과 hasAuthority가 있다.
                                //여기서는 ROLE를 붙일 필요는 굳이 없다.
                                //애는 권한 없이도 허용
                                .anyRequest().authenticated()
                        //나머지는 인증해
                )
                .formLogin(login -> login
                        .loginPage("/login")
                        .loginProcessingUrl("/doLogin")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/api/main")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("로그인 성공");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("로그인 실패");
                        })
                )
                //성공한 뒤 이동하는 페이지
                .rememberMe(rm -> rm.rememberMeParameter("remember")
                        .alwaysRemember(false)
                        .tokenValiditySeconds(2592000)
                )
                //로그인 기억하기 위한 메서드
//                .userDetailsService(userDetailsService())
                //-> 안넣어도 아래 Bean으로 등록하면 알아서 적용된다?
                //csrf쪽으로는 builder가 이어지지 않기 때문에 and로 이어준다.
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                //로그인 페이지에서 username으로 넘어오는 값 즉, id에 해당하는 값을 받아서
                Users users = userRepository.findById(username)
                        //DB에서 해당 값을 찾는다.
                        .orElseThrow(() -> new UsernameNotFoundException(username + "을 찾을 수 없습니다."));
                return users;
            }
        };
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(); //실전 사용
        return NoOpPasswordEncoder.getInstance(); // 평문으로 비교

    }

}
