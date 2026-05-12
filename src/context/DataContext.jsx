// src/context/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Seed initial data
const getInitialData = () => {
  const seats = [];
  for (let i = 1; i <= 24; i++) {
    seats.push({
      id: i,
      seatNumber: `A${i}`,
      status: 'available',
      reservedBy: null,
      reservedAt: null
    });
  }

  // Mark a few seats as reserved for demo
  seats[2].status = 'reserved';
  seats[2].reservedBy = 3;
  seats[5].status = 'reserved';
  seats[5].reservedBy = 2;

  const users = [
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
      membershipExpiry: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      password: 'sarah123',
      role: 'student',
      membershipExpiry: new Date(Date.now() + 30 * 86400000).toISOString(), // active
      createdAt: new Date().toISOString()
    }
  ];

  const bookings = [
    {
      id: 1001,
      userId: 3,
      seatId: 3,
      seatNumber: 'A3',
      bookingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'active'
    },
    {
      id: 1002,
      userId: 2,
      seatId: 6,
      seatNumber: 'A6',
      bookingDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'active'
    }
  ];
  
  const payments = [];
  const logs = [
    {
      id: 1,
      action: 'System initialized',
      user: 'System',
      timestamp: new Date().toISOString(),
      details: 'Library management system started'
    }
  ];

  return { seats, users, bookings, payments, logs };
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem('library_system_data');
    if (stored) {
      const data = JSON.parse(stored);
      setSeats(data.seats || []);
      setUsers(data.users || []);
      setBookings(data.bookings || []);
      setPayments(data.payments || []);
      setLogs(data.logs || []);
    } else {
      const initial = getInitialData();
      setSeats(initial.seats);
      setUsers(initial.users);
      setBookings(initial.bookings);
      setPayments(initial.payments);
      setLogs(initial.logs);
      // Save to localStorage immediately
      localStorage.setItem('library_system_data', JSON.stringify(initial));
    }
    setLoading(false);
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem('library_system_data', JSON.stringify(data));
  };

  const saveAll = () => {
    saveToLocalStorage({ seats, users, bookings, payments, logs });
  };

  const addLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      action,
      user: user?.name || 'System',
      timestamp: new Date().toISOString(),
      details
    };
    setLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100);
      saveToLocalStorage({ seats, users, bookings, payments, logs: updated });
      return updated;
    });
  };

  // Seat Management
  const reserveSeat = (seatId) => {
    if (!user) {
      toast.error('Please login first');
      return false;
    }
    
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status !== 'available') {
      toast.error('Seat is not available');
      return false;
    }
    
    const activeBooking = bookings.find(b => b.userId === user?.id && b.status === 'active');
    if (activeBooking) {
      toast.error('You already have an active booking. Cancel it first.');
      return false;
    }

    const newBooking = {
      id: Date.now(),
      userId: user.id,
      seatId: seat.id,
      seatNumber: seat.seatNumber,
      bookingDate: new Date().toISOString(),
      status: 'active'
    };

    const updatedSeats = seats.map(s =>
      s.id === seatId ? { ...s, status: 'reserved', reservedBy: user.id, reservedAt: new Date().toISOString() } : s
    );
    
    const updatedBookings = [...bookings, newBooking];
    
    setSeats(updatedSeats);
    setBookings(updatedBookings);
    addLog('Seat Reserved', `${user.name} reserved seat ${seat.seatNumber}`);
    saveToLocalStorage({ seats: updatedSeats, users, bookings: updatedBookings, payments, logs: [...logs, { id: Date.now(), action: 'Seat Reserved', user: user.name, timestamp: new Date().toISOString(), details: `${user.name} reserved seat ${seat.seatNumber}` }] });
    toast.success(`Seat ${seat.seatNumber} reserved successfully!`);
    return true;
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;
    
    const updatedSeats = seats.map(s =>
      s.id === booking.seatId ? { ...s, status: 'available', reservedBy: null, reservedAt: null } : s
    );
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    
    setSeats(updatedSeats);
    setBookings(updatedBookings);
    addLog('Booking Cancelled', `${user?.name} cancelled seat ${booking.seatNumber}`);
    saveToLocalStorage({ seats: updatedSeats, users, bookings: updatedBookings, payments, logs });
    toast.success('Booking cancelled successfully');
    return true;
  };

  const updateSeatStatus = (seatId, status) => {
    const updatedSeats = seats.map(s =>
      s.id === seatId ? { ...s, status, reservedBy: null, reservedAt: null } : s
    );
    setSeats(updatedSeats);
    addLog('Seat Updated', `Admin updated seat ${seats.find(s => s.id === seatId)?.seatNumber} to ${status}`);
    saveToLocalStorage({ seats: updatedSeats, users, bookings, payments, logs });
    toast.success('Seat status updated');
  };

  const addSeat = (seatNumber) => {
    if (seats.find(s => s.seatNumber === seatNumber)) {
      toast.error('Seat number already exists');
      return false;
    }
    const newSeat = {
      id: Date.now(),
      seatNumber,
      status: 'available',
      reservedBy: null,
      reservedAt: null
    };
    const updatedSeats = [...seats, newSeat];
    setSeats(updatedSeats);
    addLog('Seat Added', `Added new seat ${seatNumber}`);
    saveToLocalStorage({ seats: updatedSeats, users, bookings, payments, logs });
    toast.success('Seat added successfully');
    return true;
  };

  // Membership Renewal
  const requestRenewal = (amount) => {
    if (!user) return false;
    
    const newPayment = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      amount: amount || 50,
      paymentDate: new Date().toISOString(),
      status: 'pending',
      type: 'membership_renewal'
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    addLog('Renewal Requested', `${user.name} requested membership renewal for $${amount}`);
    saveToLocalStorage({ seats, users, bookings, payments: updatedPayments, logs });
    toast.success('Renewal request submitted. Awaiting admin approval.');
    return true;
  };

  const approveRenewal = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return false;
    
    const updatedPayments = payments.map(p =>
      p.id === paymentId ? { ...p, status: 'completed' } : p
    );
    
    const updatedUsers = users.map(u =>
      u.id === payment.userId ? { ...u, membershipExpiry: new Date(Date.now() + 365 * 86400000).toISOString() } : u
    );
    
    setPayments(updatedPayments);
    setUsers(updatedUsers);
    addLog('Renewal Approved', `Admin approved renewal for ${payment.userName}`);
    saveToLocalStorage({ seats, users: updatedUsers, bookings, payments: updatedPayments, logs });
    toast.success('Membership renewal approved!');
    return true;
  };

  const rejectRenewal = (paymentId) => {
    const updatedPayments = payments.map(p =>
      p.id === paymentId ? { ...p, status: 'rejected' } : p
    );
    setPayments(updatedPayments);
    addLog('Renewal Rejected', `Admin rejected renewal request`);
    saveToLocalStorage({ seats, users, bookings, payments: updatedPayments, logs });
    toast.success('Renewal request rejected');
    return true;
  };

  const getStudentActiveBooking = (userId) => {
    return bookings.find(b => b.userId === userId && b.status === 'active');
  };

  const getSystemStats = () => {
    const totalSeats = seats.length;
    const availableSeats = seats.filter(s => s.status === 'available').length;
    const reservedSeats = seats.filter(s => s.status === 'reserved').length;
    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const pendingRenewals = payments.filter(p => p.status === 'pending').length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const expiredMemberships = users.filter(u => u.role === 'student' && u.membershipExpiry && new Date(u.membershipExpiry) < new Date()).length;
    
    return { totalSeats, availableSeats, reservedSeats, activeBookings, pendingRenewals, totalStudents, expiredMemberships };
  };

  const getRenewalRequests = () => {
    return payments.filter(p => p.type === 'membership_renewal' && p.status === 'pending');
  };

  return (
    <DataContext.Provider value={{
      seats,
      users,
      bookings,
      payments,
      logs,
      loading,
      reserveSeat,
      cancelBooking,
      updateSeatStatus,
      addSeat,
      requestRenewal,
      approveRenewal,
      rejectRenewal,
      getStudentActiveBooking,
      getSystemStats,
      getRenewalRequests,
      addLog
    }}>
      {children}
    </DataContext.Provider>
  );
};