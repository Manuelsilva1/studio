package com.example.apilibrary.service;

import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Oferta;
import com.example.apilibrary.model.LibroOferta;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.OfertaRepository;
import com.example.apilibrary.repository.LibroOfertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class OfertaService {

    private final OfertaRepository ofertaRepository;
    private final LibroRepository libroRepository;
    private final LibroOfertaRepository libroOfertaRepository;

    @Autowired
    public OfertaService(OfertaRepository ofertaRepository,
                         LibroRepository libroRepository,
                         LibroOfertaRepository libroOfertaRepository) {
        this.ofertaRepository = ofertaRepository;
        this.libroRepository = libroRepository;
        this.libroOfertaRepository = libroOfertaRepository;
    }

    public List<Oferta> getAllOfertas(Boolean activas) {
        Specification<Oferta> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (Boolean.TRUE.equals(activas)) {
                LocalDate now = LocalDate.now();
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("fechaInicio"), now));
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.isNull(root.get("fechaFin")),
                    criteriaBuilder.greaterThanOrEqualTo(root.get("fechaFin"), now)
                ));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return ofertaRepository.findAll(spec);
    }

    public Optional<Oferta> getOfertaById(UUID id) {
        return ofertaRepository.findById(id);
    }

    public Oferta createOferta(Oferta oferta) {
        // Add validation, e.g., fechaFin >= fechaInicio if fechaFin is not null
        if (oferta.getFechaFin() != null && oferta.getFechaInicio() != null && oferta.getFechaFin().isBefore(oferta.getFechaInicio())) {
            throw new IllegalArgumentException("Fecha de fin no puede ser anterior a la fecha de inicio.");
        }
        return ofertaRepository.save(oferta);
    }

    public Optional<Oferta> updateOferta(UUID id, Oferta ofertaDetails) {
        return ofertaRepository.findById(id)
            .map(existingOferta -> {
                if (ofertaDetails.getFechaFin() != null && ofertaDetails.getFechaInicio() != null && ofertaDetails.getFechaFin().isBefore(ofertaDetails.getFechaInicio())) {
                    throw new IllegalArgumentException("Fecha de fin no puede ser anterior a la fecha de inicio.");
                }
                existingOferta.setNombre(ofertaDetails.getNombre());
                existingOferta.setDescripcion(ofertaDetails.getDescripcion());
                existingOferta.setPorcentajeDescuento(ofertaDetails.getPorcentajeDescuento());
                existingOferta.setFechaInicio(ofertaDetails.getFechaInicio());
                existingOferta.setFechaFin(ofertaDetails.getFechaFin());
                return ofertaRepository.save(existingOferta);
            });
    }

    public boolean deleteOferta(UUID id) {
        if (ofertaRepository.existsById(id)) {
            // LibroOferta entries are handled by cascade delete due to `orphanRemoval=true` and `CascadeType.ALL` on Oferta.libroOfertas
            ofertaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<LibroOferta> asociarLibroAOferta(UUID ofertaId, UUID libroId) {
        Oferta oferta = ofertaRepository.findById(ofertaId)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada con id: " + ofertaId));
        Libro libro = libroRepository.findById(libroId)
            .orElseThrow(() -> new EntityNotFoundException("Libro no encontrado con id: " + libroId));

        // Check if association already exists
        if (libroOfertaRepository.findByIdLibroIdAndIdOfertaId(libroId, ofertaId).isPresent()) {
             // Or throw an exception, or return the existing one
            return libroOfertaRepository.findByIdLibroIdAndIdOfertaId(libroId, ofertaId);
        }

        LibroOferta libroOferta = new LibroOferta(libro, oferta);
        return Optional.of(libroOfertaRepository.save(libroOferta));
    }

    public boolean desasociarLibroDeOferta(UUID ofertaId, UUID libroId) {
        if (!ofertaRepository.existsById(ofertaId)) {
            throw new EntityNotFoundException("Oferta no encontrada con id: " + ofertaId);
        }
        if (!libroRepository.existsById(libroId)) {
            throw new EntityNotFoundException("Libro no encontrado con id: " + libroId);
        }
        
        Optional<LibroOferta> libroOfertaOptional = libroOfertaRepository.findByIdLibroIdAndIdOfertaId(libroId, ofertaId);
        if (libroOfertaOptional.isPresent()) {
            libroOfertaRepository.delete(libroOfertaOptional.get());
            return true;
        }
        return false; // Association did not exist
    }
    
    public List<Libro> getLibrosPorOferta(UUID ofertaId) {
        Oferta oferta = ofertaRepository.findById(ofertaId)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada con id: " + ofertaId));
        
        return oferta.getLibroOfertas().stream()
                    .map(LibroOferta::getLibro)
                    .toList();
    }
}
