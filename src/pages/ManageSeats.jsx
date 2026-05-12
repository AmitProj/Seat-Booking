// src/pages/ManageSeats.jsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Armchair, Plus, Trash2, Edit } from 'lucide-react';

const ManageSeats = () => {
  const { seats, updateSeatStatus, addSeat } = useData();
  const [newSeatNumber, setNewSeatNumber] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddSeat = (e) => {
    e.preventDefault();
    if (newSeatNumber.trim()) {
      addSeat(newSeatNumber.trim());
      setNewSeatNumber('');
      setShowAddForm(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'reserved': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center  bg-white p-6 rounded-lg border border-gray-200">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800">Manage Seats</h1>
          <p className="text-gray-500">Add, remove or update seat status</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Seat</span>
        </button>
      </div>
      
      {showAddForm && (
        <div className="card bg-white border border-gray-200 rounded-lg p-4">
          <form onSubmit={handleAddSeat} className="flex gap-3">
            <input
              type="text"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(e.target.value)}
              placeholder="Seat number (e.g., B25)"
              className="input flex-1"
              required
            />
            <button type="submit" className="btn-primary bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md px-4 py-2">
              Add
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary bg-gray-300 hover:bg-gray-400 transition text-gray-700 rounded-md px-4 py-2">
              Cancel
            </button>
          </form>
        </div>
      )}
      
      <div className="card bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-5 gap-3">
          {seats.map(seat => (
            <div key={seat.id} className="flex items-center flex-col  space-y-4 justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
              <div className="flex items-center space-y-4 flex-col">
                <Armchair className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Seat {seat.seatNumber}</p>
                  <p className="text-xs text-gray-500">ID: {seat.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={seat.status}
                  onChange={(e) => updateSeatStatus(seat.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(seat.status)}`}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                </select>
                
                {seat.reservedBy && (
                  <span className="text-xs text-gray-400">
                    User ID: {seat.reservedBy}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">📊 Summary</p>
        <p>Total Seats: {seats.length} | Available: {seats.filter(s => s.status === 'available').length} | Reserved: {seats.filter(s => s.status === 'reserved').length}</p>
      </div>
    </div>
  );
};

export default ManageSeats;