import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

console.log(base_url);

const axiosInstance = axios.create({
    baseURL: base_url,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;