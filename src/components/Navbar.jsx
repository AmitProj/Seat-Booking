// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Armchair, CreditCard, Users, BarChart3, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const studentLinks = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/seats', icon: Armchair, label: 'Seats' },
    { to: '/student/renew', icon: CreditCard, label: 'Renew Membership' }
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/seats', icon: Armchair, label: 'Manage Seats' },
    { to: '/admin/renewals', icon: CreditCard, label: 'Renewals' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/logs', icon: FileText, label: 'System Logs' }
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user.role === 'admin' ? '/admin' : '/student'} className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl text-gray-800">LibraryHub</span>
          </Link>

          <div className="flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.name} ({user.role})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;