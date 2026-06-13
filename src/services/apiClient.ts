import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = '/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if(error.response?.status === 401){
            if(typeof window !== 'undefined'){
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/auth/signin';
            }
        }
        const djangoError = (error.response?.data as any)?.error;
        if(djangoError){
            return Promise.reject(new Error(djangoError));
        }
        return Promise.reject(error);
    }
);

export default apiClient;
