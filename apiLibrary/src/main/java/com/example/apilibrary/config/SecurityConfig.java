package com.example.apilibrary.config;

import com.example.apilibrary.service.UsuarioService;
import com.example.apilibrary.security.JwtAuthenticationEntryPoint; // Import
import com.example.apilibrary.security.JwtAuthenticationFilter;   // Import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // For more specific permissions
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Import

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UsuarioService usuarioService; 

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler; // Autowire

    @Autowired // Autowire the filter if it's a @Component
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    // Or, if JwtAuthenticationFilter is not a @Component, create it as a bean:
    // @Bean
    // public JwtAuthenticationFilter jwtAuthenticationFilter() {
    //     return new JwtAuthenticationFilter(); // JwtTokenProvider and UsuarioService would need to be manually injected or autowired within the filter if created this way
    // }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable()) 
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(unauthorizedHandler)) // Use the entry point
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/usuarios/login", "/api/usuarios/registro").permitAll()
                // Specific public GET endpoints
                .requestMatchers(HttpMethod.GET, "/api/editoriales/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/libros/**").permitAll() // Includes /api/libros/{id}/ofertas
                .requestMatchers(HttpMethod.GET, "/api/ofertas/**").permitAll()
                // Other specific public endpoints if any (e.g. health checks)
                .anyRequest().authenticated() 
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add the JWT filter

        return http.build();
    }
}
