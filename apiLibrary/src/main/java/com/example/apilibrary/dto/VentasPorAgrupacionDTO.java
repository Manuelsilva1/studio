package com.example.apilibrary.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class VentasPorAgrupacionDTO {
    private UUID idAgrupacion; // CategoriaId or EditorialId
    private String nombreAgrupacion;
    private long cantidadVentas; // Could be number of books sold or number of sales transactions
    private BigDecimal totalIngresos;

    public VentasPorAgrupacionDTO(UUID idAgrupacion, String nombreAgrupacion, long cantidadVentas, BigDecimal totalIngresos) {
        this.idAgrupacion = idAgrupacion;
        this.nombreAgrupacion = nombreAgrupacion;
        this.cantidadVentas = cantidadVentas;
        this.totalIngresos = totalIngresos;
    }
    // Getters and Setters
    public UUID getIdAgrupacion() { return idAgrupacion; }
    public void setIdAgrupacion(UUID idAgrupacion) { this.idAgrupacion = idAgrupacion; }
    public String getNombreAgrupacion() { return nombreAgrupacion; }
    public void setNombreAgrupacion(String nombreAgrupacion) { this.nombreAgrupacion = nombreAgrupacion; }
    public long getCantidadVentas() { return cantidadVentas; }
    public void setCantidadVentas(long cantidadVentas) { this.cantidadVentas = cantidadVentas; }
    public BigDecimal getTotalIngresos() { return totalIngresos; }
    public void setTotalIngresos(BigDecimal totalIngresos) { this.totalIngresos = totalIngresos; }
}
