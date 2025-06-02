package com.example.apilibrary.controller;

import com.example.apilibrary.model.Editorial;
import com.example.apilibrary.service.EditorialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For method-level security
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/editoriales")
public class EditorialController {

    private final EditorialService editorialService;

    @Autowired
    public EditorialController(EditorialService editorialService) {
        this.editorialService = editorialService;
    }

    @GetMapping
    public List<Editorial> getAllEditoriales() {
        return editorialService.getAllEditoriales();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Editorial> getEditorialById(@PathVariable UUID id) {
        return editorialService.getEditorialById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Editorial no encontrada con ID: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Editorial> createEditorial(@Valid @RequestBody Editorial editorial) {
        Editorial nuevaEditorial = editorialService.createEditorial(editorial);
        return new ResponseEntity<>(nuevaEditorial, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Editorial> updateEditorial(@PathVariable UUID id, @Valid @RequestBody Editorial editorialDetails) {
        return editorialService.updateEditorial(id, editorialDetails)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Editorial no encontrada con ID: " + id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEditorial(@PathVariable UUID id) {
        if (editorialService.deleteEditorial(id)) {
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Editorial no encontrada con ID: " + id);
        }
    }
}
