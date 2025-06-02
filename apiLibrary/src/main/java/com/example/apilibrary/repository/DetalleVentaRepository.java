package com.example.apilibrary.repository;

import com.example.apilibrary.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, UUID> {
    // Specific query methods can be added here if complex statistics require them directly
    // For example, summing quantities for a book:
    // @Query("SELECT SUM(dv.cantidad) FROM DetalleVenta dv WHERE dv.libro.id = :libroId")
    // Integer sumCantidadByLibroId(@Param("libroId") UUID libroId);
}
