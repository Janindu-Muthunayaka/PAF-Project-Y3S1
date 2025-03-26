import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const RegisterForm = ({ onSubmit }) => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);  // For handling errors
  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      alert("Registration successful");

      // Redirect to the login page after successful registration
      navigate("/login"); // Redirect to login page

      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error("Error during registration:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
