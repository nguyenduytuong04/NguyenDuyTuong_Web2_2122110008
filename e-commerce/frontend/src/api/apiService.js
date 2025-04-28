import axiosInstance from "./axiosConfig";

const API_BASE_URL = 'http://localhost:8080/api';

function callApi(endpoint, method = "GET", body, params) {
    const token = localStorage.getItem("authToken");

    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    const config = {
        method,
        url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined,
        },
        data: body ? JSON.stringify(body) : null,
    };

    console.log("callApi url: ", url);
    console.log("callApi token: ", token);

    return axiosInstance(config)
        .then((response) => response.data)
        .catch((error) => {
            console.error("API call error:", error);
            throw error;
        });
}

export const GET_ALL = async (endpoint, params) => {
    return callApi(endpoint, "GET", null, params);
};

export const GET_ID = async (endpoint, id) => {
    if (endpoint.includes('email')) {
        // Đối với endpoint email, không thêm dấu / vào cuối
        return callApi(endpoint, "GET");
    }
    // Các endpoint khác giữ nguyên logic cũ
    return callApi(endpoint + "/" + id, "GET");
};

export const POST_ADD = async (endpoint, data) => {
    return callApi(endpoint, "POST", data);
};

export const PUT_EDIT = async (endpoint, data) => {
    return callApi(endpoint, "PUT", data);
};

export const DELETE_ID = async (endpoint) => {
    return callApi(endpoint, "DELETE");
};

export const POST = async (endpoint, data) => {
    const token = localStorage.getItem('authToken');
    return callApi(endpoint, "POST", data, token);
};

export const PUT = async (endpoint, data) => {
    const token = localStorage.getItem('authToken');
    return callApi(endpoint, "PUT", data, token);
};

export const DELETE = async (endpoint) => {
    const token = localStorage.getItem('authToken');
    return callApi(endpoint, "DELETE", null, token);
};

export const GET_ID_NEW = async (endpoint, method = 'GET') => {
    try {
        const token = localStorage.getItem('authToken');
        const url = `${API_BASE_URL}/${endpoint}`;
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Kiểm tra nếu data là mảng hoặc object hợp lệ thì trả về
        if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
            return data;
        }

        // Nếu không phải dữ liệu hợp lệ và response không ok thì throw error
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return null;
    } catch (error) {
        console.error('API error details:', error);
        return null;
    }
};

export const POST_NEW = async (endpoint, data = null) => {
    try {
        const token = localStorage.getItem('authToken');
        const url = `${API_BASE_URL}/${endpoint}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export const PUT_NEW = async (endpoint, data) => {
    try {
        const token = localStorage.getItem('authToken');
        const url = `${API_BASE_URL}/${endpoint}`;
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export const DELETE_NEW = async (endpoint) => {
    try {
        const token = localStorage.getItem('authToken');
        const url = `${API_BASE_URL}/${endpoint}`;
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export const LOGIN = async (credentials) => {
    try {
        const response = await axiosInstance.post('/login', credentials);
        console.log("Response from server:", response);
        console.log("Response data:", response.data);

        // Trả về trực tiếp response.data thay vì kiểm tra
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const REGISTER = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const LOGOUT = async () => {
    try {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedEmail');
        
        // Call logout endpoint if needed
        await callApi('/auth/logout', 'POST');
        
        // Redirect to login page
        window.location.href = '/login';
        
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local storage even if API call fails
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedEmail');
        window.location.href = '/login';
        throw error;
    }
};
