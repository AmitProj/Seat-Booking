// src/pages/RenewMembership.jsx (Complete corrected version with toast import)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CreditCard, Calendar, Shield, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const RenewMembership = () => {
  const { user } = useAuth();
  const { requestRenewal, payments } = useData();
  const [amount, setAmount] = useState(50);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const membershipExpiry = user.membershipExpiry ? new Date(user.membershipExpiry) : null;
  const isMembershipActive = membershipExpiry && membershipExpiry > new Date();
  
  const pendingRequest = payments.find(p => p.userId === user.id && p.status === 'pending' && p.type === 'membership_renewal');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate payment processing
    if (!cardNumber || !cardExpiry || !cardCvv) {
      toast.error('Please fill in all payment details');
      return;
    }
    requestRenewal(amount);
    // Clear form
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">Membership Renewal</h1>
        <p className="text-gray-500">Renew your library membership to continue accessing services</p>
      </div>
      
      {/* Current Status */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-6 w-6 text-indigo-600" />
          <h3 className="font-semibold text-lg">Current Membership Status</h3>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700">
            Status: {isMembershipActive ? 
              <span className="text-green-600 font-medium">Active</span> : 
              <span className="text-red-600 font-medium">Expired</span>
            }
          </p>
          {membershipExpiry && (
            <p className="text-gray-600">
              Expiry Date: {membershipExpiry.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {pendingRequest && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            You have a pending renewal request. Please wait for admin approval.
          </p>
        </div>
      )}
      
      {!pendingRequest && (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-indigo-600" />
              Renewal Fee: $50 / year
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Payment will be processed securely. After approval, your membership will be extended by one year.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Details
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="label">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="input"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="input"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure payment simulation. No real charges will be made.</span>
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full">
            Submit Renewal Request
          </button>
        </form>
      )}
    </div>
  );
};

export default RenewMembership;