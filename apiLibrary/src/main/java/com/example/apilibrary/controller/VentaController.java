package com.example.apilibrary.controller;

import com.example.apilibrary.dto.VentaDTO;
import com.example.apilibrary.model.Usuario; // To get current user
import com.example.apilibrary.model.Venta; // For Specification building
import com.example.apilibrary.service.UsuarioService; // To get current user details
import com.example.apilibrary.service.VentaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // To get current user
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate; // For Specification

import java.time.LocalDate; // For admin filtering
import java.time.LocalTime; // For admin filtering
import java.util.ArrayList; // For Specification
import java.util.List; // For Specification
import java.util.UUID;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;
    private final UsuarioService usuarioService;

    @Autowired
    public VentaController(VentaService ventaService, UsuarioService usuarioService) {
        this.ventaService = ventaService;
        this.usuarioService = usuarioService;
    }

    // Helper to get current Usuario ID
    private UUID getCurrentUsuarioId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado.");
        }
        String username = authentication.getName();
        Usuario currentUser = usuarioService.getUsuarioByNombreUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        return currentUser.getId();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> crearVentaDesdeCarrito(Authentication authentication) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        try {
            VentaDTO ventaCreada = ventaService.crearVentaDesdeCarrito(usuarioId);
            return new ResponseEntity<>(ventaCreada, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException e) { // e.g. empty cart, insufficient stock
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<VentaDTO>> getHistorialVentasUsuario(Authentication authentication, Pageable pageable) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        Page<VentaDTO> historial = ventaService.getHistorialVentasUsuario(usuarioId, pageable);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VentaDTO> getDetallesVentaUsuario(Authentication authentication, @PathVariable UUID id) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        try {
            return ventaService.getDetalleVentaUsuario(usuarioId, id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada o no pertenece al usuario."));
        } catch (EntityNotFoundException e) { // Venta itself not found
             throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (SecurityException e) { // Venta found but access denied
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<VentaDTO>> getAllVentasAdmin(
            @RequestParam(required = false) UUID usuarioIdFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicioFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFinFilter,
            Pageable pageable) {
        
        Specification<Venta> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (usuarioIdFilter != null) {
                predicates.add(criteriaBuilder.equal(root.get("usuario").get("id"), usuarioIdFilter));
            }
            if (fechaInicioFilter != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("fechaVenta"), fechaInicioFilter.atStartOfDay()));
            }
            if (fechaFinFilter != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("fechaVenta"), fechaFinFilter.atTime(LocalTime.MAX)));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<VentaDTO> ventas = ventaService.getAllVentasAdmin(spec, pageable);
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VentaDTO> getDetallesVentaAdmin(@PathVariable UUID id) {
        return ventaService.getDetalleVentaAdmin(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada con ID: " + id));
    }
}
