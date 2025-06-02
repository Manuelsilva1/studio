package com.example.apilibrary.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class DetalleVentaDTO {
    private UUID id;
    private UUID libroId;
    private String libroTitulo; // For easier display
    private int cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    // Constructors, Getters, and Setters
    public DetalleVentaDTO() {}

    public DetalleVentaDTO(UUID id, UUID libroId, String libroTitulo, int cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
        this.id = id;
        this.libroId = libroId;
        this.libroTitulo = libroTitulo;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getLibroId() { return libroId; }
    public void setLibroId(UUID libroId) { this.libroId = libroId; }
    public String getLibroTitulo() { return libroTitulo; }
    public void setLibroTitulo(String libroTitulo) { this.libroTitulo = libroTitulo; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
