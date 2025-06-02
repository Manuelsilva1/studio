package com.example.apilibrary.service;

import com.example.apilibrary.model.Carrito;
import com.example.apilibrary.model.ItemCarrito;
import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Usuario;
import com.example.apilibrary.repository.CarritoRepository;
import com.example.apilibrary.repository.ItemCarritoRepository;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.UsuarioRepository;
import com.example.apilibrary.dto.ItemCarritoDTO; // DTO for item data
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final LibroRepository libroRepository;
    private final UsuarioRepository usuarioRepository; // To fetch Usuario

    @Autowired
    public CarritoService(CarritoRepository carritoRepository,
                          ItemCarritoRepository itemCarritoRepository,
                          LibroRepository libroRepository,
                          UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.itemCarritoRepository = itemCarritoRepository;
        this.libroRepository = libroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Carrito getOrCreateCarritoParaUsuario(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        
        return carritoRepository.findByUsuario(usuario)
            .orElseGet(() -> {
                Carrito nuevoCarrito = new Carrito();
                nuevoCarrito.setUsuario(usuario);
                nuevoCarrito.setFechaCreacion(LocalDateTime.now());
                return carritoRepository.save(nuevoCarrito);
            });
    }

    public Optional<Carrito> getCarritoDelUsuario(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        return carritoRepository.findByUsuario(usuario);
    }

    public Carrito agregarItemAlCarrito(UUID usuarioId, ItemCarritoDTO itemDTO) {
        Carrito carrito = getOrCreateCarritoParaUsuario(usuarioId);
        Libro libro = libroRepository.findById(itemDTO.getLibroId())
            .orElseThrow(() -> new EntityNotFoundException("Libro no encontrado con ID: " + itemDTO.getLibroId()));

        if (libro.getStock() < itemDTO.getCantidad()) {
            throw new IllegalArgumentException("Stock insuficiente para el libro: " + libro.getTitulo());
        }

        Optional<ItemCarrito> itemExistenteOpt = itemCarritoRepository.findByCarritoAndLibro(carrito, libro);

        if (itemExistenteOpt.isPresent()) {
            ItemCarrito itemExistente = itemExistenteOpt.get();
            int nuevaCantidad = itemExistente.getCantidad() + itemDTO.getCantidad();
            if (libro.getStock() < nuevaCantidad) {
                 throw new IllegalArgumentException("Stock insuficiente para la cantidad total del libro: " + libro.getTitulo());
            }
            itemExistente.setCantidad(nuevaCantidad);
            // precioUnitario could be updated if needed, or kept as price at time of first add
            itemCarritoRepository.save(itemExistente);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setLibro(libro);
            nuevoItem.setCantidad(itemDTO.getCantidad());
            nuevoItem.setPrecioUnitario(libro.getPrecio()); // Precio actual del libro
            itemCarritoRepository.save(nuevoItem);
            carrito.getItems().add(nuevoItem); // Ensure bidirectional relationship is maintained if not done by JPA automatically
        }
        return carritoRepository.save(carrito); // Re-save carrito to update any aggregate or version
    }

    public Optional<ItemCarrito> actualizarCantidadItem(UUID usuarioId, UUID itemId, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero.");
        }
        Carrito carrito = getOrCreateCarritoParaUsuario(usuarioId); // Ensures cart exists and belongs to user
        ItemCarrito item = itemCarritoRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item de carrito no encontrado con ID: " + itemId));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new SecurityException("El item no pertenece al carrito del usuario.");
        }
        
        Libro libro = item.getLibro();
        if (libro.getStock() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente para el libro: " + libro.getTitulo());
        }

        item.setCantidad(cantidad);
        // Optionally update precioUnitario if prices can change and cart should reflect latest
        return Optional.of(itemCarritoRepository.save(item));
    }

    public boolean eliminarItemDelCarrito(UUID usuarioId, UUID itemId) {
        Carrito carrito = getOrCreateCarritoParaUsuario(usuarioId); // Ensures cart exists and belongs to user
        ItemCarrito item = itemCarritoRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item de carrito no encontrado con ID: " + itemId));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new SecurityException("El item no pertenece al carrito del usuario.");
        }
        
        itemCarritoRepository.delete(item);
        // carrito.getItems().remove(item); // JPA should handle this due to orphanRemoval=true
        // return carritoRepository.save(carrito); // Re-save to confirm changes
        return true; // Or check if deletion was successful from repository if it returned a value
    }
}
