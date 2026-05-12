// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/student');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('library_user'));
        if (currentUser) {
          navigate(currentUser.role === 'admin' ? '/admin' : '/student');
        }
      }, 100);
    }
  };

  const resetData = () => {
    localStorage.removeItem('library_user');
    localStorage.removeItem('library_users');
    localStorage.removeItem('library_system_data');
    toast.success('Data reset! Refreshing...');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card w-full max-w-md bg-purple-200 p-8 rounded-lg    ">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col justify-center items-center">
          <div className='flex flex-col'>
            <label className="label">Email Address</label>
            <div className="relative flex bg-white rounded-md shadow-sm w-60 px-2 py-1 items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400 flex align-items-center" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@library.com"
                required
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label className="label">Password</label>
            <div className="relative flex bg-white rounded-md shadow-sm w-60 px-2 py-1 items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400 " />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input "
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-fit px-3 py-1 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex items-center space-x-2">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium mb-1">Demo Accounts:</p>
          <p>Admin: admin@library.com / admin123</p>
          <p>Student: john@example.com / john123</p>
          <p>Student: sarah@example.com / sarah123</p>
        </div>

        <div className="mt-0 pt-4 border-t border-gray-200 text-center">
          <button
            onClick={resetData}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            🔧 Reset All Data (if login fails)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;