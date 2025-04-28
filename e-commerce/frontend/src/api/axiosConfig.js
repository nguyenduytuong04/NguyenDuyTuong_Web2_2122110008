import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
            return Promise.reject({ 
                message: 'Unable to connect to the server. Please check your internet connection.'
            });
        } else {
            console.error('Error setting up request:', error.message);
            return Promise.reject({ 
                message: 'An error occurred while processing your request.'
            });
        }
    }
);

export default axiosInstance;
