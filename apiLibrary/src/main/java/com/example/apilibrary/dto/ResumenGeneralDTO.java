package com.example.apilibrary.dto;

import java.math.BigDecimal;

public class ResumenGeneralDTO {
    private long totalUsuarios;
    private long totalLibros;
    private long totalVentas;
    private BigDecimal ingresosTotales;
    // Add more fields as needed

    public ResumenGeneralDTO(long totalUsuarios, long totalLibros, long totalVentas, BigDecimal ingresosTotales) {
        this.totalUsuarios = totalUsuarios;
        this.totalLibros = totalLibros;
        this.totalVentas = totalVentas;
        this.ingresosTotales = ingresosTotales;
    }

    // Getters and Setters
    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }
    public long getTotalLibros() { return totalLibros; }
    public void setTotalLibros(long totalLibros) { this.totalLibros = totalLibros; }
    public long getTotalVentas() { return totalVentas; }
    public void setTotalVentas(long totalVentas) { this.totalVentas = totalVentas; }
    public BigDecimal getIngresosTotales() { return ingresosTotales; }
    public void setIngresosTotales(BigDecimal ingresosTotales) { this.ingresosTotales = ingresosTotales; }
}
