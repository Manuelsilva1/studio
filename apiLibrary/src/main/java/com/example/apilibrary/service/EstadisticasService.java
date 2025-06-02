package com.example.apilibrary.service;

import com.example.apilibrary.dto.LibroMasVendidoDTO;
import com.example.apilibrary.dto.ResumenGeneralDTO;
import com.example.apilibrary.dto.VentasPorAgrupacionDTO;
import com.example.apilibrary.model.DetalleVenta;
import com.example.apilibrary.model.Venta;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.UsuarioRepository;
import com.example.apilibrary.repository.VentaRepository;
import com.example.apilibrary.repository.DetalleVentaRepository; // For detailed queries

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager; // For more complex queries if needed
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.UUID;


@Service
@Transactional(readOnly = true) // Most stats are read-only
public class EstadisticasService {

    private final UsuarioRepository usuarioRepository;
    private final LibroRepository libroRepository;
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public EstadisticasService(UsuarioRepository usuarioRepository,
                               LibroRepository libroRepository,
                               VentaRepository ventaRepository,
                               DetalleVentaRepository detalleVentaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.libroRepository = libroRepository;
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
    }

    public ResumenGeneralDTO getResumenGeneral() {
        long totalUsuarios = usuarioRepository.count();
        long totalLibros = libroRepository.count();
        long totalVentas = ventaRepository.count();
        
        // Summing total from Ventas - could be slow on very large datasets
        // A dedicated aggregate query or pre-calculated value might be better
        BigDecimal ingresosTotales = ventaRepository.findAll().stream()
                                       .map(Venta::getTotal)
                                       .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new ResumenGeneralDTO(totalUsuarios, totalLibros, totalVentas, ingresosTotales);
    }

    public List<Venta> getVentasPorPeriodo(String periodo, LocalDate fechaInicio, LocalDate fechaFin) {
        // This is a simplified version. 'periodo' could be 'diario', 'mensual', 'anual'.
        // Actual aggregation (summing sales per day/month/year) would require more complex queries,
        // potentially using JPQL GROUP BY or native queries.
        // For now, it just filters by date range.
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay(); // Exclusive end date for LocalDateTime comparison

        TypedQuery<Venta> query = entityManager.createQuery(
            "SELECT v FROM Venta v WHERE v.fechaVenta >= :inicio AND v.fechaVenta < :fin ORDER BY v.fechaVenta ASC", Venta.class);
        query.setParameter("inicio", inicio);
        query.setParameter("fin", fin);
        return query.getResultList();
        // To actually aggregate, you'd do something like:
        // SELECT new com.example.apilibrary.dto.VentasAgregadasDTO(FUNCTION('date_trunc', :periodo, v.fechaVenta), SUM(v.total)) 
        // FROM Venta v WHERE v.fechaVenta >= :inicio AND v.fechaVenta < :fin 
        // GROUP BY FUNCTION('date_trunc', :periodo, v.fechaVenta)
    }

    public List<LibroMasVendidoDTO> getLibrosMasVendidos(int limite) {
        // This query gets the sum of quantities sold for each book
        // DetalleVentaRepository might need a custom query for this
        String jpql = "SELECT new com.example.apilibrary.dto.LibroMasVendidoDTO(dv.libro.id, dv.libro.titulo, SUM(dv.cantidad)) " +
                      "FROM DetalleVenta dv " +
                      "GROUP BY dv.libro.id, dv.libro.titulo " +
                      "ORDER BY SUM(dv.cantidad) DESC";
        
        TypedQuery<LibroMasVendidoDTO> query = entityManager.createQuery(jpql, LibroMasVendidoDTO.class);
        if (limite > 0) {
            query.setMaxResults(limite);
        }
        return query.getResultList();
    }

    public List<VentasPorAgrupacionDTO> getVentasPorCategoria() {
        String jpql = "SELECT new com.example.apilibrary.dto.VentasPorAgrupacionDTO(c.id, c.nombre, SUM(dv.cantidad), SUM(dv.subtotal)) " +
                      "FROM DetalleVenta dv JOIN dv.libro l JOIN l.categoria c " +
                      "GROUP BY c.id, c.nombre " +
                      "ORDER BY SUM(dv.subtotal) DESC";
        TypedQuery<VentasPorAgrupacionDTO> query = entityManager.createQuery(jpql, VentasPorAgrupacionDTO.class);
        return query.getResultList();
    }

    public List<VentasPorAgrupacionDTO> getVentasPorEditorial() {
        String jpql = "SELECT new com.example.apilibrary.dto.VentasPorAgrupacionDTO(e.id, e.nombre, SUM(dv.cantidad), SUM(dv.subtotal)) " +
                      "FROM DetalleVenta dv JOIN dv.libro l JOIN l.editorial e " +
                      "GROUP BY e.id, e.nombre " +
                      "ORDER BY SUM(dv.subtotal) DESC";
        TypedQuery<VentasPorAgrupacionDTO> query = entityManager.createQuery(jpql, VentasPorAgrupacionDTO.class);
        return query.getResultList();
    }
}
