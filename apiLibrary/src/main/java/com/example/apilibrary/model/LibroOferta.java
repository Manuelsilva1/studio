package com.example.apilibrary.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import java.io.Serializable;
import java.util.UUID;
import java.util.Objects;

@Entity
public class LibroOferta {

    @EmbeddedId
    private LibroOfertaId id;

    @ManyToOne
    @JoinColumn(name = "libro_id", insertable = false, updatable = false)
    private Libro libro;

    @ManyToOne
    @JoinColumn(name = "oferta_id", insertable = false, updatable = false)
    private Oferta oferta;
    
    // Constructors
    public LibroOferta() {}

    public LibroOferta(Libro libro, Oferta oferta) {
        this.libro = libro;
        this.oferta = oferta;
        this.id = new LibroOfertaId(libro.getId(), oferta.getId());
    }


    // Getters and Setters
    public LibroOfertaId getId() {
        return id;
    }

    public void setId(LibroOfertaId id) {
        this.id = id;
    }

    public Libro getLibro() {
        return libro;
    }

    public void setLibro(Libro libro) {
        this.libro = libro;
    }

    public Oferta getOferta() {
        return oferta;
    }

    public void setOferta(Oferta oferta) {
        this.oferta = oferta;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LibroOferta that = (LibroOferta) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
