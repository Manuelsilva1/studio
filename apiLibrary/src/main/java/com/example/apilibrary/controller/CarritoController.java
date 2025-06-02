package com.example.apilibrary.controller;

import com.example.apilibrary.model.Carrito;
import com.example.apilibrary.model.ItemCarrito;
import com.example.apilibrary.model.Usuario; // To get current user
import com.example.apilibrary.service.CarritoService;
import com.example.apilibrary.service.UsuarioService; // To get current user details
import com.example.apilibrary.dto.ItemCarritoDTO; // Already created

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // To get current user
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.EntityNotFoundException;

import java.util.UUID;

@RestController
@RequestMapping("/api/carrito")
@PreAuthorize("isAuthenticated()") // All cart operations require authentication
public class CarritoController {

    private final CarritoService carritoService;
    private final UsuarioService usuarioService; // To resolve authenticated user to Usuario entity

    @Autowired
    public CarritoController(CarritoService carritoService, UsuarioService usuarioService) {
        this.carritoService = carritoService;
        this.usuarioService = usuarioService;
    }

    // Helper to get current Usuario ID from Authentication Principal (assuming username is stored)
    private UUID getCurrentUsuarioId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado.");
        }
        String username = authentication.getName();
        Usuario currentUser = usuarioService.getUsuarioByNombreUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        return currentUser.getId();
    }

    @GetMapping
    public ResponseEntity<Carrito> getCarritoUsuario(Authentication authentication) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        return carritoService.getCarritoDelUsuario(usuarioId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(new Carrito())); // Return empty cart representation if none exists yet
    }

    @PostMapping("/items")
    public ResponseEntity<?> agregarItemAlCarrito(Authentication authentication, @Valid @RequestBody ItemCarritoDTO itemDTO) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        try {
            Carrito carritoActualizado = carritoService.agregarItemAlCarrito(usuarioId, itemDTO);
            return ResponseEntity.ok(carritoActualizado);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> actualizarCantidadItem(Authentication authentication, @PathVariable UUID itemId, @Valid @RequestBody ItemCarritoDTO itemUpdateDTO) {
        // Note: ItemCarritoDTO has libroId and cantidad. For updating, we only need cantidad.
        // A more specific DTO for quantity update might be better, e.g., CantidadUpdateDTO { int cantidad; }
        // Using itemUpdateDTO.getCantidad() for now.
        UUID usuarioId = getCurrentUsuarioId(authentication);
        try {
            ItemCarrito itemActualizado = carritoService.actualizarCantidadItem(usuarioId, itemId, itemUpdateDTO.getCantidad())
                .orElseThrow(() -> new EntityNotFoundException("No se pudo actualizar el item o no fue encontrado.")); // Should be handled by service more specifically
            return ResponseEntity.ok(itemActualizado);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (SecurityException e) { // If item does not belong to user's cart
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> eliminarItemDelCarrito(Authentication authentication, @PathVariable UUID itemId) {
        UUID usuarioId = getCurrentUsuarioId(authentication);
        try {
            if (carritoService.eliminarItemDelCarrito(usuarioId, itemId)) {
                return ResponseEntity.noContent().build();
            } else {
                // This path might not be reached if service throws exception for not found
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item no encontrado en el carrito o no se pudo eliminar.");
            }
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (SecurityException e) { // If item does not belong to user's cart
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }
}
