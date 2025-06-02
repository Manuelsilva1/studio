package com.example.apilibrary.repository;

import com.example.apilibrary.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // For filtering
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, UUID>, JpaSpecificationExecutor<Oferta> {
}
