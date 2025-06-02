package com.example.apilibrary.service;

import com.example.apilibrary.model.Editorial;
import com.example.apilibrary.repository.EditorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class EditorialService {

    private final EditorialRepository editorialRepository;

    @Autowired
    public EditorialService(EditorialRepository editorialRepository) {
        this.editorialRepository = editorialRepository;
    }

    public List<Editorial> getAllEditoriales() {
        return editorialRepository.findAll();
    }

    public Optional<Editorial> getEditorialById(UUID id) {
        return editorialRepository.findById(id);
    }

    public Editorial createEditorial(Editorial editorial) {
        // Add any validation or business logic before saving if needed
        return editorialRepository.save(editorial);
    }

    public Optional<Editorial> updateEditorial(UUID id, Editorial editorialDetails) {
        return editorialRepository.findById(id)
            .map(existingEditorial -> {
                existingEditorial.setNombre(editorialDetails.getNombre());
                existingEditorial.setDireccion(editorialDetails.getDireccion());
                existingEditorial.setSitioWeb(editorialDetails.getSitioWeb());
                return editorialRepository.save(existingEditorial);
            });
    }

    public boolean deleteEditorial(UUID id) {
        if (editorialRepository.existsById(id)) {
            editorialRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
