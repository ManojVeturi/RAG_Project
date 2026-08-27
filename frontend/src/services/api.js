import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Don't attach an old token to login/register requests
    const isAuthRequest =
      config.url === "/auth/login" ||
      config.url === "/auth/register";

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear authentication when an authenticated
    // request fails, not when login itself returns 401.
    const requestUrl = error.config?.url;

    const isAuthRequest =
      requestUrl === "/auth/login" ||
      requestUrl === "/auth/register";

    if (
      error.response?.status === 401 &&
      !isAuthRequest
    ) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;