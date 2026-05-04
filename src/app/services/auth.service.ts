import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, SignupRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';

    currentUser = signal<User | null>(null);

    constructor(private http: HttpClient) { }

    register(payload: SignupRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
            tap(res => {
                this.saveToken(res.token);
                this.currentUser.set({ _id: res.user._id, name: res.user.name, email: res.user.email });
            })
        );
    }

    login(payload: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                this.saveToken(res.token);
                this.currentUser.set({ _id: res.user._id, name: res.user.name, email: res.user.email });
            })
        );
    }

    getMe() {
        return this.http.get<{ user: User }>(`${this.apiUrl}/me`);
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser.set(null);
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // Charge l'utilisateur connecté depuis le serveur (appelé au démarrage de l'app)
    initUser() {
        if (this.isLoggedIn()) {
            this.getMe().subscribe({
                next: (res) => this.currentUser.set(res.user),
                error: () => this.logout()
            });
        }
    }
}
