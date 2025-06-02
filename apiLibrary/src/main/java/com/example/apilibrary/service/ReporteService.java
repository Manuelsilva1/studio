package com.example.apilibrary.service;

import com.example.apilibrary.dto.InventarioReporteDTO;
import com.example.apilibrary.dto.VentaDTO; // Re-use VentaDTO or Venta entity for sales report data
import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Venta;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification; // For filtering sales
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true) // Reports are typically read-only operations
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final LibroRepository libroRepository;
    private final VentaService ventaService; // To reuse mapping logic

    @PersistenceContext
    private EntityManager entityManager;


    @Autowired
    public ReporteService(VentaRepository ventaRepository, LibroRepository libroRepository, VentaService ventaService) {
        this.ventaRepository = ventaRepository;
        this.libroRepository = libroRepository;
        this.ventaService = ventaService;
    }

    /**
     * Prepares data for a sales report within a given date range.
     * @param fechaInicio Start date of the report period.
     * @param fechaFin End date of the report period.
     * @return A list of VentaDTO objects representing sales in that period.
     */
    public List<VentaDTO> generarDatosReporteVentas(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay(); // Make the end date exclusive for LocalDateTime

        Specification<Venta> spec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.between(root.get("fechaVenta"), inicio, fin);
        
        List<Venta> ventas = ventaRepository.findAll(spec);
        // Reuse the mapping logic from VentaService. If VentaService.mapVentaToVentaDTO is not public,
        // duplicate or make it accessible. For this example, assume it can be called or logic duplicated.
        // For simplicity, let's assume VentaService has a public or package-private helper.
        // If VentaService::mapVentaToVentaDTOInternal is not accessible, we'd map here.
        return ventas.stream()
                     .map(ventaService::mapVentaToVentaDTOInternal) // Assumes such a method exists or is created
                     .collect(Collectors.toList());
    }
    
    /**
     * Prepares data for an inventory report.
     * @return A list of InventarioReporteDTO objects representing the current state of inventory.
     */
    public List<InventarioReporteDTO> generarDatosReporteInventario() {
        // Using JPQL to fetch all necessary fields for the report DTO directly
        String jpql = "SELECT new com.example.apilibrary.dto.InventarioReporteDTO(" +
                      "l.id, l.titulo, l.autor, l.isbn, c.nombre, e.nombre, l.precio, l.stock, l.fechaPublicacion) " +
                      "FROM Libro l JOIN l.categoria c JOIN l.editorial e " +
                      "ORDER BY l.titulo ASC";
        TypedQuery<InventarioReporteDTO> query = entityManager.createQuery(jpql, InventarioReporteDTO.class);
        return query.getResultList();
    }
}
