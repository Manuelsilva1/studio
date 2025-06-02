package com.example.apilibrary.service;

import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Categoria;
import com.example.apilibrary.model.Editorial;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.CategoriaRepository;
import com.example.apilibrary.repository.EditorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate; // Correct import for Predicate
import jakarta.persistence.EntityNotFoundException;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class LibroService {

    private final LibroRepository libroRepository;
    private final EditorialRepository editorialRepository;
    private final CategoriaRepository categoriaRepository;

    @Autowired
    public LibroService(LibroRepository libroRepository,
                        EditorialRepository editorialRepository,
                        CategoriaRepository categoriaRepository) {
        this.libroRepository = libroRepository;
        this.editorialRepository = editorialRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Libro> getAllLibros(UUID categoriaId, UUID editorialId, String autor, String titulo) {
        Specification<Libro> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (categoriaId != null) {
                predicates.add(criteriaBuilder.equal(root.get("categoria").get("id"), categoriaId));
            }
            if (editorialId != null) {
                predicates.add(criteriaBuilder.equal(root.get("editorial").get("id"), editorialId));
            }
            if (autor != null && !autor.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("autor")), "%" + autor.toLowerCase() + "%"));
            }
            if (titulo != null && !titulo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%"));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return libroRepository.findAll(spec);
    }

    public Optional<Libro> getLibroById(UUID id) {
        return libroRepository.findById(id);
    }

    public Libro createLibro(Libro libro, UUID editorialId, UUID categoriaId) {
        Editorial editorial = editorialRepository.findById(editorialId)
            .orElseThrow(() -> new EntityNotFoundException("Editorial not found with id: " + editorialId));
        Categoria categoria = categoriaRepository.findById(categoriaId)
            .orElseThrow(() -> new EntityNotFoundException("Categoria not found with id: " + categoriaId));
        
        libro.setEditorial(editorial);
        libro.setCategoria(categoria);

        // Check for ISBN uniqueness
        if (libroRepository.findByIsbn(libro.getIsbn()).isPresent()) {
            throw new IllegalArgumentException("ISBN " + libro.getIsbn() + " already exists.");
        }
        
        return libroRepository.save(libro);
    }

    public Optional<Libro> updateLibro(UUID id, Libro libroDetails, UUID editorialId, UUID categoriaId) {
        return libroRepository.findById(id)
            .map(existingLibro -> {
                Editorial editorial = editorialRepository.findById(editorialId)
                    .orElseThrow(() -> new EntityNotFoundException("Editorial not found with id: " + editorialId));
                Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria not found with id: " + categoriaId));

                // Check for ISBN uniqueness if ISBN is being changed
                if (!existingLibro.getIsbn().equals(libroDetails.getIsbn()) &&
                    libroRepository.findByIsbn(libroDetails.getIsbn()).isPresent()) {
                    throw new IllegalArgumentException("ISBN " + libroDetails.getIsbn() + " already exists.");
                }

                existingLibro.setTitulo(libroDetails.getTitulo());
                existingLibro.setAutor(libroDetails.getAutor());
                existingLibro.setIsbn(libroDetails.getIsbn());
                existingLibro.setPrecio(libroDetails.getPrecio());
                existingLibro.setStock(libroDetails.getStock());
                existingLibro.setDescripcion(libroDetails.getDescripcion());
                existingLibro.setFechaPublicacion(libroDetails.getFechaPublicacion());
                existingLibro.setEditorial(editorial);
                existingLibro.setCategoria(categoria);
                return libroRepository.save(existingLibro);
            });
    }

    public boolean deleteLibro(UUID id) {
        if (libroRepository.existsById(id)) {
            // Consider related entities like LibroOferta, ItemCarrito, DetalleVenta
            // Depending on desired behavior (cascade delete, disallow delete if referenced),
            // additional logic might be needed here or handled by database constraints.
            // For now, simple delete.
            libroRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
