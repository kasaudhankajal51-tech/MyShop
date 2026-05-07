import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo') || '{}')
            : null;

        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    const { data } = await api.post('/upload', formData, config);
    return data;
};

export const uploadImages = async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append('images', file);
    });

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    const { data } = await api.post('/upload/multiple', formData, config);
    return data;
};

export default api;
