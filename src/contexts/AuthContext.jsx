import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Restore user from localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after restoring user
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Persist user in localStorage
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Remove user from localStorage
  };

  const isClient = () => currentUser?.role === 'client';
  const isAstrologer = () => currentUser?.role === 'astrologer';

  if (loading) {
    // Optionally, render a loading state while restoring user
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isClient, isAstrologer }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};