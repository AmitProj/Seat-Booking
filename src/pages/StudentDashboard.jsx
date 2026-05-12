// src/pages/StudentDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Armchair, CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentActiveBooking, seats, bookings } = useData();
  
  const activeBooking = getStudentActiveBooking(user.id);
  const activeSeat = activeBooking ? seats.find(s => s.id === activeBooking.seatId) : null;
  
  const membershipExpiry = user.membershipExpiry ? new Date(user.membershipExpiry) : null;
  const isMembershipActive = membershipExpiry && membershipExpiry > new Date();
  const daysUntilExpiry = membershipExpiry ? Math.ceil((membershipExpiry - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  
  const recentBookings = bookings.filter(b => b.userId === user.id).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
        <p className="text-gray-500">Manage your library activities from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Booking Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Current Booking</h3>
            <Armchair className="h-6 w-6 text-indigo-600" />
          </div>
          {activeSeat ? (
            <div>
              <p className="text-2xl font-bold text-indigo-600">{activeSeat.seatNumber}</p>
              <p className="text-sm text-gray-500 mt-1">Reserved on {new Date(activeBooking.bookingDate).toLocaleDateString()}</p>
              <Link to="/student/seats" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
                Manage Booking →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-3">No active booking</p>
              <Link to="/student/seats" className="btn-primary inline-block text-sm">
                Reserve a Seat
              </Link>
            </div>
          )}
        </div>

        {/* Membership Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Membership Status</h3>
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          {isMembershipActive ? (
            <div>
              <div className="flex items-center space-x-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Active</span>
              </div>
              <p className="text-sm text-gray-600">Expires in {daysUntilExpiry} days</p>
              <p className="text-xs text-gray-400 mt-1">{membershipExpiry.toLocaleDateString()}</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Expired</span>
              </div>
              <Link to="/student/renew" className="btn-primary inline-block text-sm mt-2">
                Renew Now
              </Link>
            </div>
          )}
          {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-700">Your membership expires soon!</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/student/seats" className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition">
            <Armchair className="h-5 w-5" />
            <span>View Seats</span>
          </Link>
          <Link to="/student/renew" className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
            <CreditCard className="h-5 w-5" />
            <span>Renew Membership</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Seat {booking.seatNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No booking history</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;