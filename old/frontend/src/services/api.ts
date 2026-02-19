import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5046';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized, possibly token expired
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