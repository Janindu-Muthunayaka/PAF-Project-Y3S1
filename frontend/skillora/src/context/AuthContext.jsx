import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const loggedInUser = await AuthService.login(credentials);
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/home");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
