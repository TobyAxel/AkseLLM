import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5046';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }  

    if (refreshToken) {
        config.headers['X-Refresh-Token'] = refreshToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized, possibly token expired
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.reload();
            }
            
            // Extract error message and attach the message to the error object for easier handling in components
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            error.message = errorMessage;
        } else {
            error.message = 'Network error. Please check your connection.';
        }

        return Promise.reject(error);
    }
);