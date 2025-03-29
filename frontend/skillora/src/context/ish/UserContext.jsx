import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // This is a dummy user since we don't have authentication yet
  const [user, setUser] = useState({
    id: 'dummy-user-id',
    username: 'ish',
    displayName: 'ish',
    avatar: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);