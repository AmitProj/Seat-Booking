// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SeatSelection from './pages/SeatSelection';
import RenewMembership from './pages/RenewMembership';
import AdminDashboard from './pages/AdminDashboard';
import ManageSeats from './pages/ManageSeats';
import ManageRenewals from './pages/ManageRenewals';
import Reports from './pages/Reports';
import SystemLogs from './pages/SystemLogs';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/seats" element={
                <ProtectedRoute role="student">
                  <SeatSelection />
                </ProtectedRoute>
              } />
              <Route path="/student/renew" element={
                <ProtectedRoute role="student">
                  <RenewMembership />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/seats" element={
                <ProtectedRoute role="admin">
                  <ManageSeats />
                </ProtectedRoute>
              } />
              <Route path="/admin/renewals" element={
                <ProtectedRoute role="admin">
                  <ManageRenewals />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/admin/logs" element={
                <ProtectedRoute role="admin">
                  <SystemLogs />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;