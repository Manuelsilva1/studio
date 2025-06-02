package com.example.apilibrary.service;

import com.example.apilibrary.model.Carrito;
import com.example.apilibrary.model.DetalleVenta;
import com.example.apilibrary.model.ItemCarrito;
import com.example.apilibrary.model.Libro;
import com.example.apilibrary.model.Usuario;
import com.example.apilibrary.model.Venta;
import com.example.apilibrary.repository.CarritoRepository;
import com.example.apilibrary.repository.LibroRepository;
import com.example.apilibrary.repository.UsuarioRepository;
import com.example.apilibrary.repository.VentaRepository;
import com.example.apilibrary.repository.ItemCarritoRepository; // For clearing cart
import com.example.apilibrary.dto.VentaDTO;
import com.example.apilibrary.dto.DetalleVentaDTO;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LibroRepository libroRepository;
    private final ItemCarritoRepository itemCarritoRepository; // To delete cart items

    @Autowired
    public VentaService(VentaRepository ventaRepository,
                        CarritoRepository carritoRepository,
                        UsuarioRepository usuarioRepository,
                        LibroRepository libroRepository,
                        ItemCarritoRepository itemCarritoRepository) {
        this.ventaRepository = ventaRepository;
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.libroRepository = libroRepository;
        this.itemCarritoRepository = itemCarritoRepository;
    }

    public VentaDTO crearVentaDesdeCarrito(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        Carrito carrito = carritoRepository.findByUsuario(usuario)
            .orElseThrow(() -> new EntityNotFoundException("Carrito no encontrado para el usuario ID: " + usuarioId));

        if (carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío. No se puede crear una venta.");
        }

        Venta nuevaVenta = new Venta();
        nuevaVenta.setUsuario(usuario);
        nuevaVenta.setFechaVenta(LocalDateTime.now());

        BigDecimal totalVenta = BigDecimal.ZERO;
        List<DetalleVenta> detallesVenta = new ArrayList<>();

        for (ItemCarrito itemCarrito : carrito.getItems()) {
            Libro libro = itemCarrito.getLibro();
            int cantidadComprar = itemCarrito.getCantidad();

            if (libro.getStock() < cantidadComprar) {
                throw new IllegalArgumentException("Stock insuficiente para el libro: " + libro.getTitulo() + ". Stock disponible: " + libro.getStock() + ", Solicitado: " + cantidadComprar);
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(nuevaVenta);
            detalle.setLibro(libro);
            detalle.setCantidad(cantidadComprar);
            detalle.setPrecioUnitario(itemCarrito.getPrecioUnitario()); // Usar precio del carrito
            detalle.setSubtotal(itemCarrito.getPrecioUnitario().multiply(BigDecimal.valueOf(cantidadComprar)));
            
            detallesVenta.add(detalle);
            totalVenta = totalVenta.add(detalle.getSubtotal());

            // Disminuir stock del libro
            libro.setStock(libro.getStock() - cantidadComprar);
            libroRepository.save(libro);
        }

        nuevaVenta.setTotal(totalVenta);
        nuevaVenta.setDetalles(detallesVenta); // JPA should handle saving details due to CascadeType.ALL

        Venta ventaGuardada = ventaRepository.save(nuevaVenta);

        // Limpiar carrito después de la venta
        itemCarritoRepository.deleteAll(carrito.getItems()); // More efficient than one by one
        carrito.getItems().clear(); // Clear the collection in the managed entity
        carritoRepository.save(carrito); // Update carrito (e.g. if it has a total or item count) - optional

        return mapVentaToVentaDTO(ventaGuardada);
    }

    public Page<VentaDTO> getHistorialVentasUsuario(UUID usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        // The VentaRepository method needs to be adapted or use Specification
        // For simplicity, let's assume a method exists or we filter after fetching (not ideal for pagination)
        // A better approach would be: Page<Venta> ventas = ventaRepository.findByUsuario(usuario, pageable);
        // For now, using findAll with Specification for demonstration
        Specification<Venta> spec = (root, query, cb) -> cb.equal(root.get("usuario"), usuario);
        Page<Venta> ventasPage = ventaRepository.findAll(spec, pageable);
        return ventasPage.map(this::mapVentaToVentaDTO);
    }
    
    public Optional<VentaDTO> getDetalleVentaUsuario(UUID usuarioId, UUID ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
            .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con ID: " + ventaId));
        if (venta.getUsuario() == null || !venta.getUsuario().getId().equals(usuarioId)) {
            // Or throw SecurityException if user is not null but IDs don't match
             throw new SecurityException("El usuario no tiene permiso para ver esta venta o la venta no le pertenece.");
        }
        return Optional.of(mapVentaToVentaDTO(venta));
    }

    public Page<VentaDTO> getAllVentasAdmin(Specification<Venta> spec, Pageable pageable) {
        // Specification can be used for filtering by date range, user, etc. by admin
        return ventaRepository.findAll(spec, pageable).map(this::mapVentaToVentaDTO);
    }

    public Optional<VentaDTO> getDetalleVentaAdmin(UUID ventaId) {
        return ventaRepository.findById(ventaId).map(this::mapVentaToVentaDTO);
    }


    // Helper to map Venta entity to VentaDTO
    VentaDTO mapVentaToVentaDTOInternal(Venta venta) { // Changed to package-private
        List<DetalleVentaDTO> detalleDTOs = venta.getDetalles().stream()
            .map(dv -> new DetalleVentaDTO(
                dv.getId(),
                dv.getLibro().getId(),
                dv.getLibro().getTitulo(),
                dv.getCantidad(),
                dv.getPrecioUnitario(),
                dv.getSubtotal()
            ))
            .collect(Collectors.toList());

        return new VentaDTO(
            venta.getId(),
            venta.getUsuario() != null ? venta.getUsuario().getId() : null,
            venta.getUsuario() != null ? venta.getUsuario().getNombreUsuario() : "N/A",
            venta.getFechaVenta(),
            venta.getTotal(),
            detalleDTOs
        );
    }
}
