package com.example.apilibrary.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.UUID;

public class ItemCarritoDTO {

    @NotNull(message = "El ID del libro no puede ser nulo.")
    private UUID libroId;

    @NotNull(message = "La cantidad no puede ser nula.")
    @Min(value = 1, message = "La cantidad debe ser al menos 1.")
    private Integer cantidad;

    // Getters and Setters
    public UUID getLibroId() {
        return libroId;
    }

    public void setLibroId(UUID libroId) {
        this.libroId = libroId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
