// src/pages/AdminDashboard.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import { Users, Armchair, CreditCard, Clock, TrendingUp, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const { getSystemStats, seats, bookings, users, payments } = useData();
  const stats = getSystemStats();
  
  const recentActivities = [
    { label: 'Active Bookings', value: stats.activeBookings, icon: Armchair, color: 'blue' },
    { label: 'Available Seats', value: stats.availableSeats, icon: Armchair, color: 'green' },
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'purple' },
    { label: 'Pending Renewals', value: stats.pendingRenewals, icon: CreditCard, color: 'orange' },
    { label: 'Expired Memberships', value: stats.expiredMemberships, icon: Calendar, color: 'red' },
    { label: 'Total Bookings', value: bookings.length, icon: TrendingUp, color: 'indigo' },
  ];

  const recentBookings = bookings.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of library system operations</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-white p-6 rounded-lg border border-gray-200">
        {recentActivities.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
            red: 'bg-red-100 text-red-600',
            indigo: 'bg-indigo-100 text-indigo-600',
          };
          return (
            <div key={idx} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-gray-200">
        {/* Recent Bookings */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map(booking => {
                const student = users.find(u => u.id === booking.userId);
                return (
                  <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium">{student?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">Seat {booking.seatNumber}</p>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No bookings yet</p>
          )}
        </div>
        
        {/* Recent Renewal Requests */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Renewal Requests</h3>
          {recentPayments.filter(p => p.type === 'membership_renewal').length > 0 ? (
            <div className="space-y-3">
              {recentPayments.filter(p => p.type === 'membership_renewal').map(payment => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.userName}</p>
                    <p className="text-xs text-gray-500">Amount: ${payment.amount}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No renewal requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;