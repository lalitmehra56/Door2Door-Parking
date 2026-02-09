import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any saved data on app start - require fresh login every time
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    const data = response.data;

    console.log('Login response:', data);
    console.log('User role from backend:', data.role);

    const loggedInUser = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      phone: '',
      role: data.role,
    };

    console.log('Logged in user object:', loggedInUser);
    console.log('User role type:', typeof loggedInUser.role);

    setToken(data.token);
    setUser(loggedInUser);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    console.log('User saved to localStorage');
    console.log('Token:', data.token.substring(0, 20) + '...');

    return loggedInUser;
  };

  const register = async (data, asOwner = false) => {
    if (asOwner) {
      await authApi.registerAsOwner(data);
    } else {
      await authApi.register(data);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
