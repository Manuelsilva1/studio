package com.example.apilibrary.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import java.math.BigDecimal;
import java.time.LocalDate;

public class OfertaDTO {

    @NotNull(message = "El nombre de la oferta no puede ser nulo.")
    private String nombre;

    private String descripcion;

    @DecimalMin(value = "0.0", inclusive = true, message = "El porcentaje de descuento no puede ser negativo.")
    @DecimalMax(value = "100.0", inclusive = true, message = "El porcentaje de descuento no puede ser mayor a 100.")
    private BigDecimal porcentajeDescuento; // Can be null if offer is not discount-based

    @NotNull(message = "La fecha de inicio no puede ser nula.")
    private LocalDate fechaInicio;

    private LocalDate fechaFin; // Can be null for ongoing offers

    // Getters and Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPorcentajeDescuento() { return porcentajeDescuento; }
    public void setPorcentajeDescuento(BigDecimal porcentajeDescuento) { this.porcentajeDescuento = porcentajeDescuento; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
}
