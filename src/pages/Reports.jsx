// src/pages/Reports.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart3, TrendingUp, Users, Armchair, DollarSign, Calendar } from 'lucide-react';

const Reports = () => {
  const { seats, bookings, users, payments, getSystemStats } = useData();
  const stats = getSystemStats();
  
  // Calculate additional metrics
  const totalRevenue = payments
    .filter(p => p.status === 'completed' && p.type === 'membership_renewal')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const completedRenewals = payments.filter(p => p.status === 'completed' && p.type === 'membership_renewal').length;
  const cancellationRate = bookings.length > 0 
    ? ((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100).toFixed(1)
    : 0;
    
  const seatUtilization = stats.totalSeats > 0 
    ? ((stats.reservedSeats / stats.totalSeats) * 100).toFixed(1)
    : 0;

  const reportCards = [
    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'green' },
    { label: 'Completed Renewals', value: completedRenewals, icon: TrendingUp, color: 'blue' },
    { label: 'Seat Utilization', value: `${seatUtilization}%`, icon: Armchair, color: 'purple' },
    { label: 'Cancellation Rate', value: `${cancellationRate}%`, icon: BarChart3, color: 'orange' },
    { label: 'Active Students', value: stats.totalStudents, icon: Users, color: 'indigo' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'red' },
  ];

  const topStudents = users
    .filter(u => u.role === 'student')
    .map(student => ({
      ...student,
      bookingCount: bookings.filter(b => b.userId === student.id).length
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
        <p className="text-gray-500">System performance and usage statistics</p>
      </div>
      
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-white p-6 rounded-lg border border-gray-200">
        {reportCards.map((card, idx) => {
          const Icon = card.icon;
          const colorClasses = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
            indigo: 'bg-indigo-100 text-indigo-600',
            red: 'bg-red-100 text-red-600',
          };
          return (
            <div key={idx} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[card.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Top Students */}
        <div className="card bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600" />
            Most Active Students
          </h3>
          {topStudents.length > 0 ? (
            <div className="space-y-3">
              {topStudents.map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-indigo-600">{student.bookingCount}</p>
                    <p className="text-xs text-gray-500">bookings</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No booking data available</p>
          )}
        </div>
        
        {/* Monthly Activity Summary */}
        <div className="card bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Recent Activity Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Seats</span>
              <span className="font-semibold">{stats.totalSeats}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Available Seats</span>
              <span className="font-semibold text-green-600">{stats.availableSeats}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Reserved Seats</span>
              <span className="font-semibold text-orange-600">{stats.reservedSeats}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Pending Renewals</span>
              <span className="font-semibold text-yellow-600">{stats.pendingRenewals}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Expired Memberships</span>
              <span className="font-semibold text-red-600">{stats.expiredMemberships}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Option */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-3">Export Report</h3>
        <p className="text-gray-500 text-sm mb-4">Download system data for further analysis</p>
        <button 
          onClick={() => {
            const reportData = {
              generatedAt: new Date().toISOString(),
              stats,
              totalBookings: bookings.length,
              totalPayments: payments.length,
              totalRevenue,
              seatUtilization: `${seatUtilization}%`
            };
            const dataStr = JSON.stringify(reportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `library_report_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Report exported successfully');
          }}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg px-4 py-2"
        >
          Export JSON Report
        </button>
      </div>
    </div>
  );
};

export default Reports;