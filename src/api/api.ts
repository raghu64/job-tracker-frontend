import axios from "axios";
import { getAuthUser, removeAuthUser } from "../utils/storage";
// import { useNavigate } from "react-router-dom";

export const API_URL = process.env.API_URL || "http://localhost:4000/api/v1";  

// const navigate = useNavigate();
const api = axios.create({
  baseURL: API_URL,
});

// Function to get token from localStorage
function getToken() {
  try {
    const stored = getAuthUser();
    if (!stored) return null;
    return stored.token;
  } catch {
    return null;
  }
}

const AUTH_ROUTES = ["/login", "/logout", "/register"];

// Request interceptor to add Authorization header conditionally
api.interceptors.request.use((config) => {
  // Check if URL matches one of the auth routes
  const isAuthRoute = AUTH_ROUTES.some(route => config.url?.includes(route));

  if (!isAuthRoute) {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // console.trace("No token found, cancelling request to:", config.url);
      return Promise.reject(
          new axios.Cancel("No authorization token available")
        );
    }
  } else {
    if (config.headers && config.headers["Authorization"]) {
      delete config.headers["Authorization"];
    }
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.log("error: ", err);
      removeAuthUser();
      window.location.href = "/login"; // or use React Router's navigate
      // navigate("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
