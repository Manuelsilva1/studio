package com.example.apilibrary.dto;

import java.util.UUID;

public class LoginResponseDTO {
    private String token;
    private String tipo = "Bearer";
    private UUID usuarioId;
    private String nombreUsuario;
    private String rol;


    public LoginResponseDTO(String token, UUID usuarioId, String nombreUsuario, String rol) {
        this.token = token;
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
