import axios from 'axios';
import { env } from '@/constants/env';

const baseURL = `${env.apiUrl}/api/${env.apiVersion}`;

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token ?? parsed?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        //
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
