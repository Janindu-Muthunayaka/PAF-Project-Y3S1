import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>This is the homepage!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
