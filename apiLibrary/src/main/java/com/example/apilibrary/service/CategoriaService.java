package com.example.apilibrary.service;

import com.example.apilibrary.model.Categoria;
import com.example.apilibrary.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> getCategoriaById(UUID id) {
        return categoriaRepository.findById(id);
    }

    public Categoria createCategoria(Categoria categoria) {
        // Add any validation or business logic before saving if needed
        return categoriaRepository.save(categoria);
    }

    public Optional<Categoria> updateCategoria(UUID id, Categoria categoriaDetails) {
        return categoriaRepository.findById(id)
            .map(existingCategoria -> {
                existingCategoria.setNombre(categoriaDetails.getNombre());
                existingCategoria.setDescripcion(categoriaDetails.getDescripcion());
                return categoriaRepository.save(existingCategoria);
            });
    }

    public boolean deleteCategoria(UUID id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
