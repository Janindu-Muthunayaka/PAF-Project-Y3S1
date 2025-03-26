import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import RegisterForm from "../../components/login/RegisterForm";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);

  const handleRegister = (userData) => {
    register(userData);
  };

  return (
    <div>
      <h2>Register</h2>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
