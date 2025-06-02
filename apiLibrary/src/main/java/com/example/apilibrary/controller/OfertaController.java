package com.example.apilibrary.controller;

import com.example.apilibrary.model.Oferta;
import com.example.apilibrary.model.LibroOferta; // For response of association
import com.example.apilibrary.service.OfertaService;
import com.example.apilibrary.dto.OfertaDTO; // DTO for create/update
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ofertas")
public class OfertaController {

    private final OfertaService ofertaService;

    @Autowired
    public OfertaController(OfertaService ofertaService) {
        this.ofertaService = ofertaService;
    }

    @GetMapping
    public List<Oferta> getAllOfertas(@RequestParam(required = false) Boolean activas) {
        return ofertaService.getAllOfertas(activas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Oferta> getOfertaById(@PathVariable UUID id) {
        return ofertaService.getOfertaById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferta no encontrada con ID: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createOferta(@Valid @RequestBody OfertaDTO ofertaDTO) {
        try {
            Oferta nuevaOferta = new Oferta();
            // Manual mapping from DTO to Entity
            nuevaOferta.setNombre(ofertaDTO.getNombre());
            nuevaOferta.setDescripcion(ofertaDTO.getDescripcion());
            nuevaOferta.setPorcentajeDescuento(ofertaDTO.getPorcentajeDescuento());
            nuevaOferta.setFechaInicio(ofertaDTO.getFechaInicio());
            nuevaOferta.setFechaFin(ofertaDTO.getFechaFin());
            
            Oferta ofertaCreada = ofertaService.createOferta(nuevaOferta);
            return new ResponseEntity<>(ofertaCreada, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) { // For date validation from service
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOferta(@PathVariable UUID id, @Valid @RequestBody OfertaDTO ofertaDTO) {
        try {
            Oferta ofertaDetails = new Oferta(); // Create a new Oferta instance to pass to service
            ofertaDetails.setNombre(ofertaDTO.getNombre());
            ofertaDetails.setDescripcion(ofertaDTO.getDescripcion());
            ofertaDetails.setPorcentajeDescuento(ofertaDTO.getPorcentajeDescuento());
            ofertaDetails.setFechaInicio(ofertaDTO.getFechaInicio());
            ofertaDetails.setFechaFin(ofertaDTO.getFechaFin());

            return ofertaService.updateOferta(id, ofertaDetails)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferta no encontrada con ID: " + id));
        } catch (IllegalArgumentException e) { // For date validation from service
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOferta(@PathVariable UUID id) {
        if (ofertaService.deleteOferta(id)) {
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferta no encontrada con ID: " + id);
        }
    }

    @PostMapping("/{ofertaId}/libros/{libroId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> asociarLibroAOferta(@PathVariable UUID ofertaId, @PathVariable UUID libroId) {
        try {
            return ofertaService.asociarLibroAOferta(ofertaId, libroId)
                .map(libroOferta -> new ResponseEntity<>(libroOferta, HttpStatus.CREATED)) // Or just HttpStatus.OK if it already existed and was returned
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo asociar el libro a la oferta.")); // Should not happen if service returns Optional properly
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{ofertaId}/libros/{libroId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desasociarLibroDeOferta(@PathVariable UUID ofertaId, @PathVariable UUID libroId) {
        try {
            if (ofertaService.desasociarLibroDeOferta(ofertaId, libroId)) {
                return ResponseEntity.noContent().build();
            } else {
                // This case implies the association didn't exist, which can be a 404 or 204.
                // Depending on strictness, service could throw EntityNotFound if either parent entity doesn't exist.
                // If the association itself is the target, and it's not found, 404 is also reasonable.
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asociación no encontrada o no se pudo eliminar.");
            }
        } catch (EntityNotFoundException e) { // If Oferta or Libro not found
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
