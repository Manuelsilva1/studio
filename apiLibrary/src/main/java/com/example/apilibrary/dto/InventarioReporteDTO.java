package com.example.apilibrary.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class InventarioReporteDTO {
    private UUID libroId;
    private String titulo;
    private String autor;
    private String isbn;
    private String categoriaNombre;
    private String editorialNombre;
    private BigDecimal precio;
    private int stock;
    private LocalDate fechaPublicacion;

    public InventarioReporteDTO(UUID libroId, String titulo, String autor, String isbn, String categoriaNombre, String editorialNombre, BigDecimal precio, int stock, LocalDate fechaPublicacion) {
        this.libroId = libroId;
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.categoriaNombre = categoriaNombre;
        this.editorialNombre = editorialNombre;
        this.precio = precio;
        this.stock = stock;
        this.fechaPublicacion = fechaPublicacion;
    }

    // Getters and Setters
    public UUID getLibroId() { return libroId; }
    public void setLibroId(UUID libroId) { this.libroId = libroId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getCategoriaNombre() { return categoriaNombre; }
    public void setCategoriaNombre(String categoriaNombre) { this.categoriaNombre = categoriaNombre; }
    public String getEditorialNombre() { return editorialNombre; }
    public void setEditorialNombre(String editorialNombre) { this.editorialNombre = editorialNombre; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public LocalDate getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDate fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
}
