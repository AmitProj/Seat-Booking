// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Initialize users if not exists
const initializeUsers = () => {
  if (!localStorage.getItem('library_users')) {
    const defaultUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@library.com',
        password: 'admin123',
        role: 'admin',
        membershipExpiry: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'John Student',
        email: 'john@example.com',
        password: 'john123',
        role: 'student',
        membershipExpiry: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'sarah123',
        role: 'student',
        membershipExpiry: new Date(Date.now() + 30 * 86400000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('library_users', JSON.stringify(defaultUsers));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    const storedUser = localStorage.getItem('library_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('library_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      localStorage.setItem('library_user', JSON.stringify(userWithoutPass));
      toast.success(`Welcome back, ${userWithoutPass.name}!`);
      return true;
    }
    toast.error('Invalid email or password');
    return false;
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('library_users') || '[]');
    if (users.find(u => u.email === email)) {
      toast.error('Email already registered');
      return false;
    }
    
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'student',
      membershipExpiry: null,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('library_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    localStorage.setItem('library_user', JSON.stringify(userWithoutPass));
    toast.success('Registration successful!');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};