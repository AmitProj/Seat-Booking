// src/pages/ManageRenewals.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const ManageRenewals = () => {
  const { getRenewalRequests, approveRenewal, rejectRenewal, users } = useData();
  const pendingRenewals = getRenewalRequests();
  
  const handleApprove = (paymentId) => {
    approveRenewal(paymentId);
  };
  
  const handleReject = (paymentId) => {
    rejectRenewal(paymentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Membership Renewals</h1>
        <p className="text-gray-500">Review and process student renewal requests</p>
      </div>
      
      {pendingRenewals.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No pending renewal requests</p>
          <p className="text-sm text-gray-400">All renewal requests have been processed</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingRenewals.map(payment => {
            const student = users.find(u => u.id === payment.userId);
            return (
              <div key={payment.id} className="card">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{payment.userName}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Email: {student?.email}</p>
                    <p className="text-gray-600 text-sm">Amount: ${payment.amount}</p>
                    <p className="text-gray-500 text-xs">Requested: {new Date(payment.paymentDate).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(payment.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageRenewals;
