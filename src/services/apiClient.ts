import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 1. Define base configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

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
        // You can attach tokens here later
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 4. Response interceptor – unified error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Log errors, show notifications, etc.
        console.error('API Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;