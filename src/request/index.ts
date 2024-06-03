import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";

export const request = axios.create({
  baseURL: "http://13.60.86.61:8000/api/v1",
  timeout: 10000,
  headers: {
    Authorization: Cookies.get(TOKEN) ? "Bearer " + Cookies.get(TOKEN) : null
  }
});
