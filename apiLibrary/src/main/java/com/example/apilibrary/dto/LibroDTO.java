package com.example.apilibrary.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

// This DTO is used for creating and updating Libro entities
// It separates the foreign key IDs from the main entity structure for request payloads
public class LibroDTO {

    @NotNull(message = "El título no puede ser nulo")
    private String titulo;

    @NotNull(message = "El autor no puede ser nulo")
    private String autor;

    @NotNull(message = "El ISBN no puede ser nulo")
    private String isbn;

    @NotNull(message = "El ID de la editorial no puede ser nulo")
    private UUID editorialId;

    @NotNull(message = "El ID de la categoría no puede ser nulo")
    private UUID categoriaId;

    @NotNull(message = "El precio no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor que 0")
    private BigDecimal precio;

    @NotNull(message = "El stock no puede ser nulo")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String descripcion;
    private LocalDate fechaPublicacion;

    // Getters and Setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public UUID getEditorialId() { return editorialId; }
    public void setEditorialId(UUID editorialId) { this.editorialId = editorialId; }
    public UUID getCategoriaId() { return categoriaId; }
    public void setCategoriaId(UUID categoriaId) { this.categoriaId = categoriaId; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDate fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
}
