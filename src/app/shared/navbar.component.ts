import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    constructor(public authService: AuthService, private router: Router) { }

    // Déconnection
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}