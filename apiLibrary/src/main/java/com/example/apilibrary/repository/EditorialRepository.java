package com.example.apilibrary.repository;

import com.example.apilibrary.model.Editorial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface EditorialRepository extends JpaRepository<Editorial, UUID> {
}
