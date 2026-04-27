import axios from "axios";

/**
 * Create Axios instance
 */
const API = axios.create({
  baseURL: "https://eshop-backend-y0e7.onrender.com", // 🔁 change in production
  withCredentials: false,
});

/**
 * 🔐 REQUEST INTERCEPTOR
 * Add headers before every request
 */
API.interceptors.request.use(
  async (config) => {
    // ✅ Current backend auth (your adminGuard)
    config.headers.Authorization = "ADMIN_SECRET";

    /**
     * 🚀 OPTIONAL (Future Upgrade)
     * If you switch to Clerk JWT:
     *
     * import { getToken } from "@clerk/clerk-react";
     * const token = await getToken();
     * config.headers.Authorization = `Bearer ${token}`;
     */

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ⚠️ RESPONSE INTERCEPTOR
 * Handle global errors
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);

    // Example: Unauthorized
    if (error.response?.status === 403) {
      alert("Unauthorized! Check admin access.");
    }

    return Promise.reject(error);
  }
);

export default API;