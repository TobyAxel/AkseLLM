import type { AuthResponseDto } from "../domain/DTOs/AuthResponseDto";
import type { LoginDto } from "../domain/DTOs/LoginDto";
import type { RegisterDto } from "../domain/DTOs/RegisterDto";
import type { Profile } from "../domain/profile";
import { api } from "./api";

export const authService = {
    async register(data: RegisterDto): Promise<AuthResponseDto> {
        const response = await api.post<AuthResponseDto>('/auth/register', data);

        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        return response.data;
    },

    async login(data: LoginDto): Promise<AuthResponseDto> {
        const response = await api.post<AuthResponseDto>('/auth/login', data);

        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get<Profile>('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('authToken');
    }
};