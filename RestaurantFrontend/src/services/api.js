import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://restaurant-api-safi-dnandtgwbeamd9d5.uaenorth-01.azurewebsites.net/api",
});

api.interceptors.request.use(config => {

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;