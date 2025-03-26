import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "../../components/login/LoginForm";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = (credentials) => {
    login(credentials);
  };

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
