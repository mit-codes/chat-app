import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response;
};

export default api;
