package com.example.apilibrary.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.UUID;
import java.util.Objects;

@Embeddable
public class LibroOfertaId implements Serializable {

    @Column(name = "libro_id")
    private UUID libroId;

    @Column(name = "oferta_id")
    private UUID ofertaId;

    // Constructors
    public LibroOfertaId() {}

    public LibroOfertaId(UUID libroId, UUID ofertaId) {
        this.libroId = libroId;
        this.ofertaId = ofertaId;
    }

    // Getters and Setters
    public UUID getLibroId() {
        return libroId;
    }

    public void setLibroId(UUID libroId) {
        this.libroId = libroId;
    }

    public UUID getOfertaId() {
        return ofertaId;
    }

    public void setOfertaId(UUID ofertaId) {
        this.ofertaId = ofertaId;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LibroOfertaId that = (LibroOfertaId) o;
        return Objects.equals(libroId, that.libroId) &&
               Objects.equals(ofertaId, that.ofertaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(libroId, ofertaId);
    }
}
