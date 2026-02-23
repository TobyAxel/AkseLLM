import request from "./api";
import type { UserProfile } from "../domain";

type LoginDto = {
    email: string;
    password: string;
};

type RegisterDto = {
    username: string;
    email: string;
    password: string;
};

type AuthResponseDto = {
    user: UserProfile;
    message?: string;
};

export const authService = {
    // POST /api/auth/register
    register: (data: RegisterDto) =>
        request<AuthResponseDto>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // POST /api/auth/login
    login: (data: LoginDto) =>
        request<AuthResponseDto>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // GET /api/auth/me
    me: () =>
        request<AuthResponseDto>("/api/auth/me"),

    // POST /api/auth/logout
    logout: () =>
        request<void>("/api/auth/logout", { method: "POST" }),
};