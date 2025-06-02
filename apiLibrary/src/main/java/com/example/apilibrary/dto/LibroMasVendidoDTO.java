package com.example.apilibrary.dto;

import java.util.UUID;

public class LibroMasVendidoDTO {
    private UUID libroId;
    private String titulo;
    private long cantidadVendida;

    public LibroMasVendidoDTO(UUID libroId, String titulo, long cantidadVendida) {
        this.libroId = libroId;
        this.titulo = titulo;
        this.cantidadVendida = cantidadVendida;
    }
    // Getters and Setters
    public UUID getLibroId() { return libroId; }
    public void setLibroId(UUID libroId) { this.libroId = libroId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public long getCantidadVendida() { return cantidadVendida; }
    public void setCantidadVendida(long cantidadVendida) { this.cantidadVendida = cantidadVendida; }
}
