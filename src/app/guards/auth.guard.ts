import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

// Rediriger vers /login si l'user n'est pas connecté
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // Acces autorisé
        return true;
    }

    // Pas de token, -> /login
    router.navigate(['/login']);
    return false;
}