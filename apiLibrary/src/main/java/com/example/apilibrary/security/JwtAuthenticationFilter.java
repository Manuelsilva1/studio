package com.example.apilibrary.security;

import com.example.apilibrary.service.UsuarioService; // Our UserDetailsService
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

// Making this a @Component to allow autowiring if needed, though it's often created as a @Bean in SecurityConfig
// For this setup, it will be created as a bean in SecurityConfig.
// So, remove @Component if it's instantiated via new in SecurityConfig.
// Let's keep it as @Component for now, and it can be autowired in SecurityConfig.
@Component 
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioService usuarioService; // UserDetailsService

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);
                Claims claims = tokenProvider.getClaimsFromJWT(jwt);
                String rolesString = claims.get("roles", String.class);

                // UserDetails userDetails = usuarioService.loadUserByUsername(username); 
                // If using UserDetails directly from UserDetailsService:
                // UsernamePasswordAuthenticationToken authentication = 
                //     new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Or, construct UserDetails on the fly if not fetching from DB for every request (using roles from token)
                List<GrantedAuthority> authorities = Arrays.stream(rolesString.split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
                
                // Create UserDetails object for UsernamePasswordAuthenticationToken
                // Here, we use the username from the token and authorities from the token.
                // The password field is irrelevant here as the token is already validated.
                UserDetails userDetailsForToken = org.springframework.security.core.userdetails.User
                                                    .withUsername(username)
                                                    .password("") // Password not needed for token-based auth context
                                                    .authorities(authorities)
                                                    .build();


                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetailsForToken, null, authorities);
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
