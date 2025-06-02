package com.example.apilibrary.repository;

import com.example.apilibrary.model.LibroOferta;
import com.example.apilibrary.model.LibroOfertaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID; // Required for findByOfertaIdAndLibroId
import java.util.Optional; // Required for findByOfertaIdAndLibroId


@Repository
public interface LibroOfertaRepository extends JpaRepository<LibroOferta, LibroOfertaId> {
    // Method to find by composite key parts for easier deletion/check
    Optional<LibroOferta> findByIdLibroIdAndIdOfertaId(UUID libroId, UUID ofertaId);
    void deleteByIdLibroIdAndIdOfertaId(UUID libroId, UUID ofertaId);
}
