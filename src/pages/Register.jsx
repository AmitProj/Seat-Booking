// src/pages/Register.jsx (Complete corrected version)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const success = register(name, email, password);
    if (success) {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card w-full max-w-md bg-purple-200 p-8 rounded-lg    ">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join our library community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 flex flex-col justify-center items-center">
          <div className='flex flex-col  '>
            <label className="label">Full Name</label>
            <div className="relative flex bg-white rounded-md w-60 px-2 py-1 items-center gap-2">
              <UserIcon className=" h-5 w-5 text-gray-400 " />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input "
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label className="label">Email Address</label>
            <div className="relative flex bg-white rounded-md shadow-sm w-60 px-2 py-1 items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400 " />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input "
                placeholder="student@example.com"
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

          <div className='flex flex-col'>
            <label className="label">Confirm Password</label>
            <div className="relative flex bg-white rounded-md shadow-sm w-60 px-2 py-1 items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400 " />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input "
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-fit px-3 py-1 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex items-center space-x-2">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;