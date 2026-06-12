import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 1. Define base configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// 2. Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Request interceptor (optional – add auth tokens, etc.)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 4. Response interceptor – unified error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if(error.response?.status === 401){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            if(typeof window !== 'undefined'){
                window.location.href = '/auth/signin';
            }
        }
        // Handles explicit error payloads passed up from Django
        const djangoError = (error.response?.data as any)?.error;
        if(djangoError){
            return Promise.reject(new Error(djangoError));
        }
        return Promise.reject(error);
    }
);

export default apiClient;