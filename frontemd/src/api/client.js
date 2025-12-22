// src/api/client.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"; // [web:314]

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// ========== Request interceptor: add access token ==========
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== Response interceptor: refresh on 401 + global errors ==========
let isRefreshing = false;
let pendingRequests = [];

/**
 * Optionally centralize error logging/notifications here later.
 */
function handleGlobalError(error) {
  // Example: console log; you can replace with toast/snackbar UI.
  console.error("API error:", error.response?.status, error.response?.data);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Handle 401 with refresh token
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        handleGlobalError(error);
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((newAccess) => {
            originalConfig.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalConfig);
          })
          .catch((err) => Promise.reject(err));
      }

      try {
        isRefreshing = true;

        const res = await axios.post(`${API_BASE}/api/auth/refresh/`, {
          refresh,
        }); // [web:321][web:306]

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        // Replay queued requests with new token
        pendingRequests.forEach(({ resolve }) => resolve(newAccess));
        pendingRequests = [];

        originalConfig.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalConfig);
      } catch (refreshError) {
        pendingRequests.forEach(({ reject }) => reject(refreshError));
        pendingRequests = [];
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        handleGlobalError(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Non‑401 errors
    handleGlobalError(error);
    return Promise.reject(error);
  }
);

export default api;
