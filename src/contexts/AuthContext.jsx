import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user from localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
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

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isClient, isAstrologer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);