import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = "";
  password = "";
  error = "";

  isLoading = false;

  constructor(private authService: AuthService, private router: Router){}

  onSubmit(): void {
    this.isLoading = true;
    this.error = "";

    this.authService.login({email: this.email, password: this.password}).subscribe({
      next: () => {
        
        this.router.navigate(['/listings']);
      },
      error: (err) => {
        this.error = err.error?.message || "Une erreur est surevenue";
        this.isLoading = false;
      }
    });
  }
}
