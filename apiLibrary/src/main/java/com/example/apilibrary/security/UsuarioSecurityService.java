package com.example.apilibrary.security;

import com.example.apilibrary.model.Usuario;
import com.example.apilibrary.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service("usuarioSecurityService") // Bean name used in @PreAuthorize
public class UsuarioSecurityService {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioSecurityService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Checks if the authenticated user's ID matches the requested userId.
     * Used in @PreAuthorize("#userId == authentication.principal.id") or similar,
     * or as a custom method like @usuarioSecurityService.hasUserId(authentication, #id).
     *
     * @param authentication The current authentication object.
     * @param requestedUserId The UUID of the user resource being accessed.
     * @return true if the authenticated user's ID matches the requestedUserId, false otherwise.
     */
    public boolean hasUserId(Authentication authentication, UUID requestedUserId) {
        if (authentication == null || !authentication.isAuthenticated() || requestedUserId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        String username;

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        } else {
            return false; // Principal is not of an expected type
        }
        
        // Fetch the Usuario entity for the authenticated user
        Usuario authenticatedUser = usuarioService.getUsuarioByNombreUsuario(username).orElse(null);
        
        if (authenticatedUser == null) {
            return false; // Authenticated user not found in DB (should not happen if token is valid)
        }
        
        return authenticatedUser.getId().equals(requestedUserId);
    }
}
