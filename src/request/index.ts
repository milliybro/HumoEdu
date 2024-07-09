import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";
import { useAuth } from "../states/auth";

export const request = axios.create({
  baseURL: "http://172.16.12.15:8000/api/v1/",
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN);
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await useAuth.getState().refreshAccessToken();
      const newToken = Cookies.get(TOKEN); 
      originalRequest.headers.Authorization = `Bearer ${newToken}`; 
      return request(originalRequest);
    }

    return Promise.reject(error);
  }
);
