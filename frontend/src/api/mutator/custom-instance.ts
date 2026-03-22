import Axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_API_TOKEN;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    return AXIOS_INSTANCE(config).then((response: AxiosResponse<T>) => response.data);
};