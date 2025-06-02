package com.example.apilibrary.repository;

import com.example.apilibrary.model.ItemCarrito;
import com.example.apilibrary.model.Carrito;
import com.example.apilibrary.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, UUID> {
    Optional<ItemCarrito> findByCarritoAndLibro(Carrito carrito, Libro libro);
    //Potentially add methods to find by carritoId and libroId if needed directly
}
