import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";

export const request = axios.create({
  baseURL: "https://api.humotalim.uz/api/v1",
  timeout: 10000,
  
});

request.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN);
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

