export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}