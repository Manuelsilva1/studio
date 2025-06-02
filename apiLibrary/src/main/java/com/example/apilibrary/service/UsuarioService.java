package com.example.apilibrary.service;

import com.example.apilibrary.model.Usuario;
import com.example.apilibrary.repository.UsuarioRepository;
import com.example.apilibrary.dto.UsuarioRegistroDTO; // Will be created later

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // Will be injected
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;


import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import java.util.List;


@Service
@Transactional
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder; // Will be injected via setter or constructor

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Setter for PasswordEncoder to avoid circular dependency if PasswordEncoder is in SecurityConfig
    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String nombreUsuario) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con nombre de usuario: " + nombreUsuario));

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()));

        return new User(usuario.getNombreUsuario(), usuario.getContrasenaHash(), authorities);
    }

    public Usuario registrarNuevoUsuario(UsuarioRegistroDTO registroDTO) {
        if (usuarioRepository.existsByNombreUsuario(registroDTO.getNombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya existe: " + registroDTO.getNombreUsuario());
        }
        if (registroDTO.getEmail() != null && usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado: " + registroDTO.getEmail());
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(registroDTO.getNombreUsuario());
        nuevoUsuario.setContrasenaHash(passwordEncoder.encode(registroDTO.getContrasena()));
        nuevoUsuario.setEmail(registroDTO.getEmail());
        nuevoUsuario.setRol(registroDTO.getRol() != null ? registroDTO.getRol() : "USER"); // Default to USER role

        return usuarioRepository.save(nuevoUsuario);
    }

    public Optional<Usuario> getUsuarioById(UUID id) {
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> getUsuarioByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    // DTO for registration - to be created in com.example.apilibrary.dto package
    // For now, this is a placeholder for the subtask to know about it.
    // It will be created in a subsequent step if not handled by the subtask creating this service.
}
