package com.example.apilibrary.controller;

import com.example.apilibrary.model.Usuario;
import com.example.apilibrary.service.UsuarioService;
import com.example.apilibrary.dto.UsuarioRegistroDTO; // Already created
import com.example.apilibrary.dto.LoginRequestDTO;
import com.example.apilibrary.dto.LoginResponseDTO;
import com.example.apilibrary.security.JwtTokenProvider; // Will be created in security package

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // For login
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.EntityNotFoundException;


import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager; // Injected for login
    private final JwtTokenProvider jwtTokenProvider; // Injected for token generation

    @Autowired
    public UsuarioController(UsuarioService usuarioService,
                             AuthenticationManager authenticationManager,
                             JwtTokenProvider jwtTokenProvider) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioRegistroDTO registroDTO) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarNuevoUsuario(registroDTO);
            // Do not return password hash
            // Consider a UsuarioResponseDTO if more fields need to be hidden/transformed
            return new ResponseEntity<>(new UsuarioResponseDTO(nuevoUsuario.getId(), nuevoUsuario.getNombreUsuario(), nuevoUsuario.getEmail(), nuevoUsuario.getRol()), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getNombreUsuario(),
                        loginRequestDTO.getContrasena()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);
        
        // Fetch user details to include in the response
        Usuario usuario = usuarioService.getUsuarioByNombreUsuario(loginRequestDTO.getNombreUsuario())
            .orElseThrow(() -> new EntityNotFoundException("Error interno: Usuario no encontrado después de la autenticación."));


        return ResponseEntity.ok(new LoginResponseDTO(jwt, usuario.getId(), usuario.getNombreUsuario(), usuario.getRol()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioSecurityService.hasUserId(authentication, #id)")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable UUID id) {
        return usuarioService.getUsuarioById(id)
                .map(usuario -> new UsuarioResponseDTO(usuario.getId(), usuario.getNombreUsuario(), usuario.getEmail(), usuario.getRol()))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + id));
    }
    
    // Inner DTO for user responses (to avoid exposing contrasenaHash)
    // Can be moved to a separate file in dto package if preferred
    public static class UsuarioResponseDTO {
        private UUID id;
        private String nombreUsuario;
        private String email;
        private String rol;

        public UsuarioResponseDTO(UUID id, String nombreUsuario, String email, String rol) {
            this.id = id;
            this.nombreUsuario = nombreUsuario;
            this.email = email;
            this.rol = rol;
        }
        // Getters
        public UUID getId() { return id; }
        public String getNombreUsuario() { return nombreUsuario; }
        public String getEmail() { return email; }
        public String getRol() { return rol; }
    }
}
