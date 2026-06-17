import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// Request interceptor to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401) and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and has not been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Prevent infinite loop if the refresh request itself fails
      if (
        originalRequest.url === "api/token/refresh/" ||
        originalRequest.url === "api/token/"
      ) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");
      
      if (refreshToken) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem("access", newAccessToken);
          
          // Update the Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed, logging out...", refreshError);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;