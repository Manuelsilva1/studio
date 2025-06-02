package com.example.apilibrary.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class VentaDTO {
    private UUID id;
    private UUID usuarioId; // Can be null
    private String nombreUsuario; // For easier display
    private LocalDateTime fechaVenta;
    private BigDecimal total;
    private List<DetalleVentaDTO> detalles;

    // Constructors, Getters, and Setters
    public VentaDTO() {}

    public VentaDTO(UUID id, UUID usuarioId, String nombreUsuario, LocalDateTime fechaVenta, BigDecimal total, List<DetalleVentaDTO> detalles) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.fechaVenta = fechaVenta;
        this.total = total;
        this.detalles = detalles;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public LocalDateTime getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDateTime fechaVenta) { this.fechaVenta = fechaVenta; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public List<DetalleVentaDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaDTO> detalles) { this.detalles = detalles; }
}
