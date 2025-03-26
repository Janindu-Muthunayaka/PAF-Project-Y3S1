import axios from "axios";

const API_URL = "https://your-api-url.com"; // Replace with your actual API URL

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export default {
  login,
  register,
};
