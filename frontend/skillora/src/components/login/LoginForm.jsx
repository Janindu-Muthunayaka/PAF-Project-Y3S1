import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const LoginForm = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);  // For handling errors
  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      alert("Login successful");

      // Redirect to the homepage after successful login
      navigate("/homepage"); // Redirect to homepage

      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error("Error during login:", error);
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
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
