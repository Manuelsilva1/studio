package com.example.apilibrary.controller;

import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Oferta; // For the /ofertas endpoint
import com.example.apilibrary.service.LibroService;
import com.example.apilibrary.service.OfertaService; // To get offers for a book
import com.example.apilibrary.dto.LibroDTO; // DTO for create/update
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.EntityNotFoundException; // For service layer exceptions

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors; // Added for /ofertas endpoint

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    private final LibroService libroService;
    private final OfertaService ofertaService; // Injected to handle /libros/{id}/ofertas

    @Autowired
    public LibroController(LibroService libroService, OfertaService ofertaService) {
        this.libroService = libroService;
        this.ofertaService = ofertaService;
    }

    @GetMapping
    public List<Libro> getAllLibros(
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) UUID editorialId,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String titulo) {
        return libroService.getAllLibros(categoriaId, editorialId, autor, titulo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Libro> getLibroById(@PathVariable UUID id) {
        return libroService.getLibroById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado con ID: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLibro(@Valid @RequestBody LibroDTO libroDTO) {
        try {
            Libro nuevoLibro = new Libro();
            // Manual mapping from DTO to Entity
            nuevoLibro.setTitulo(libroDTO.getTitulo());
            nuevoLibro.setAutor(libroDTO.getAutor());
            nuevoLibro.setIsbn(libroDTO.getIsbn());
            nuevoLibro.setPrecio(libroDTO.getPrecio());
            nuevoLibro.setStock(libroDTO.getStock());
            nuevoLibro.setDescripcion(libroDTO.getDescripcion());
            nuevoLibro.setFechaPublicacion(libroDTO.getFechaPublicacion());
            
            Libro libroCreado = libroService.createLibro(nuevoLibro, libroDTO.getEditorialId(), libroDTO.getCategoriaId());
            return new ResponseEntity<>(libroCreado, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IllegalArgumentException e) { // For ISBN conflict
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLibro(@PathVariable UUID id, @Valid @RequestBody LibroDTO libroDTO) {
        try {
            Libro libroDetails = new Libro(); // Create a new Libro instance to pass to service
            libroDetails.setTitulo(libroDTO.getTitulo());
            libroDetails.setAutor(libroDTO.getAutor());
            libroDetails.setIsbn(libroDTO.getIsbn());
            libroDetails.setPrecio(libroDTO.getPrecio());
            libroDetails.setStock(libroDTO.getStock());
            libroDetails.setDescripcion(libroDTO.getDescripcion());
            libroDetails.setFechaPublicacion(libroDTO.getFechaPublicacion());

            return libroService.updateLibro(id, libroDetails, libroDTO.getEditorialId(), libroDTO.getCategoriaId())
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado con ID: " + id));
        } catch (EntityNotFoundException e) { // For Categoria/Editorial not found
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IllegalArgumentException e) { // For ISBN conflict
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLibro(@PathVariable UUID id) {
        if (libroService.deleteLibro(id)) {
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado con ID: " + id);
        }
    }

    @GetMapping("/{id}/ofertas")
    public ResponseEntity<List<Oferta>> getOfertasByLibroId(@PathVariable UUID id) {
        // This endpoint logic might fit better in OfertaService if it's about "ofertas related to a libro"
        // Or LibroService could have a method that delegates to OfertaService or uses LibroOfertaRepository.
        // For now, using OfertaService directly.
        // First check if book exists
        if (!libroService.getLibroById(id).isPresent()) {
             throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado con ID: " + id);
        }
        // The OfertaService.getLibrosPorOferta is inverted. We need ofertas POR libro.
        // Let's assume OfertaService will have a method like: getOfertasDelLibro(UUID libroId)
        // For now, this will be a placeholder for that logic.
        // A simple way is to fetch Libro and get its associated LibroOfertas, then map to Ofertas.
        // This is already handled by Libro.getLibroOfertas() if the relationship is bidirectional,
        // but that returns LibroOferta entities. We need Oferta entities.
        // The OfertaService.getLibrosPorOferta(ofertaId) is the wrong direction.
        // We need a new method in OfertaService or LibroService.
        // Let's use the one created in OfertaService: getLibrosPorOferta is actually for getting libros for an oferta.
        // We need ofertas for a libro.
        // A quick solution:
        Libro libro = libroService.getLibroById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        List<Oferta> ofertas = libro.getLibroOfertas().stream().map(lo -> lo.getOferta()).distinct().collect(Collectors.toList());
        return ResponseEntity.ok(ofertas);
        // A better way would be a dedicated service method:
        // List<Oferta> ofertas = ofertaService.getOfertasByLibroId(id);
        // return ResponseEntity.ok(ofertas);
    }
}
