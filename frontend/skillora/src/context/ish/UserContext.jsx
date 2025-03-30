import { createContext, useState, useContext, useEffect } from 'react';
import api, { sessionId } from '../../services/ish/api'; // Assuming this is the correct path to your api file

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'dummy-user-id',
    username: 'ish',
    displayName: 'ish',
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await sessionId.getUserData();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data. Using default profile.');
        // Keep the dummy user data in case of failure
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Provide a function to refresh user data
  const refreshUserData = async () => {
    try {
      setLoading(true);
      const userData = await sessionId.getUserData();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      setError('Failed to refresh user data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);