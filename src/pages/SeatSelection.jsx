// src/pages/SeatSelection.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Armchair, CheckCircle, XCircle } from 'lucide-react';

const SeatSelection = () => {
  const { user } = useAuth();
  const { seats, reserveSeat, cancelBooking, getStudentActiveBooking } = useData();
  
  const activeBooking = getStudentActiveBooking(user.id);
  
  const handleReserve = (seatId) => {
    if (activeBooking) {
      return;
    }
    reserveSeat(seatId);
  };
  
  const handleCancel = () => {
    if (activeBooking) {
      cancelBooking(activeBooking.id);
    }
  };

  // Group seats into rows of 6 for better display
  const rows = [];
  for (let i = 0; i < seats.length; i += 6) {
    rows.push(seats.slice(i, i + 6));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div >
          <h1 className="text-2xl font-bold text-gray-800">Seat Selection</h1>
          <p className="text-gray-500">Choose an available seat to reserve</p>
        </div>
        {activeBooking && (
          <button onClick={handleCancel} className="btn-danger">
            Cancel Current Booking
          </button>
        )}
      </div>
      
      {activeBooking && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">
            You currently have seat <strong>{activeBooking.seatNumber}</strong> reserved.
            Cancel it before reserving another seat.
          </p>
        </div>
      )}
      
      <div className="card">
        <div className="mb-6 flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded"></div>
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-500 rounded"></div>
            <span className="text-sm">Your Seat</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3 flex-wrap">
              {row.map(seat => {
                const isUserSeat = activeBooking && activeBooking.seatId === seat.id;
                let statusColor = 'bg-green-500 hover:bg-green-600';
                let statusText = 'Available';
                
                if (seat.status === 'reserved') {
                  if (isUserSeat) {
                    statusColor = 'bg-yellow-500';
                    statusText = 'Your Seat';
                  } else {
                    statusColor = 'bg-red-500 cursor-not-allowed';
                    statusText = 'Reserved';
                  }
                }
                
                return (
                  <button
                    key={seat.id}
                    onClick={() => seat.status === 'available' && !activeBooking && handleReserve(seat.id)}
                    disabled={seat.status === 'reserved' && !isUserSeat}
                    className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${statusColor} text-white shadow-md ${seat.status === 'reserved' && !isUserSeat ? 'opacity-60' : ''}`}
                  >
                    <Armchair className="h-6 w-6 mb-1" />
                    <span className="text-sm font-bold">{seat.seatNumber}</span>
                    <span className="text-xs">{statusText}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          <p>💡 Tip: Click on any available (green) seat to reserve it. You can only have one active booking at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;