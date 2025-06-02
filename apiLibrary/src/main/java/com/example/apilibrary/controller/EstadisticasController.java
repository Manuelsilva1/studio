package com.example.apilibrary.controller;

import com.example.apilibrary.dto.LibroMasVendidoDTO;
import com.example.apilibrary.dto.ResumenGeneralDTO;
import com.example.apilibrary.dto.VentasPorAgrupacionDTO;
import com.example.apilibrary.model.Venta; // If service returns List<Venta> for ventas-por-periodo
import com.example.apilibrary.service.EstadisticasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@PreAuthorize("hasRole('ADMIN')") // All statistics endpoints are admin-only
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    @Autowired
    public EstadisticasController(EstadisticasService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenGeneralDTO> getResumenGeneral() {
        ResumenGeneralDTO resumen = estadisticasService.getResumenGeneral();
        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/ventas-por-periodo")
    public ResponseEntity<List<Venta>> getVentasPorPeriodo(
            @RequestParam String periodo, // e.g., "diario", "mensual", "anual" - service needs to handle this
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            // The service method getVentasPorPeriodo currently returns List<Venta> and is simplified.
            // A more advanced implementation would return aggregated DTOs.
            List<Venta> ventas = estadisticasService.getVentasPorPeriodo(periodo, fechaInicio, fechaFin);
            return ResponseEntity.ok(ventas);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parámetros de período o fecha inválidos: " + e.getMessage());
        }
    }

    @GetMapping("/libros-mas-vendidos")
    public ResponseEntity<List<LibroMasVendidoDTO>> getLibrosMasVendidos(
            @RequestParam(defaultValue = "10") int limite) {
        if (limite <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El límite debe ser un número positivo.");
        }
        List<LibroMasVendidoDTO> libros = estadisticasService.getLibrosMasVendidos(limite);
        return ResponseEntity.ok(libros);
    }

    @GetMapping("/ventas-por-categoria")
    public ResponseEntity<List<VentasPorAgrupacionDTO>> getVentasPorCategoria() {
        List<VentasPorAgrupacionDTO> ventas = estadisticasService.getVentasPorCategoria();
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/ventas-por-editorial")
    public ResponseEntity<List<VentasPorAgrupacionDTO>> getVentasPorEditorial() {
        List<VentasPorAgrupacionDTO> ventas = estadisticasService.getVentasPorEditorial();
        return ResponseEntity.ok(ventas);
    }
}
