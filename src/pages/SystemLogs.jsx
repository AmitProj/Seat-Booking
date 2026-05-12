// src/pages/SystemLogs.jsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileText, Search, Filter, Clock, User, Info } from 'lucide-react';

const SystemLogs = () => {
  const { logs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  
  const actions = ['all', ...new Set(logs.map(log => log.action))];
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">System Logs</h1>
        <p className="text-gray-500">Track all system activities and user actions</p>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="w-48 ">
            <div className="relative bg-white rounded-md  w-full px-2 py-2 items-center gap-2 border border-gray-300">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="input pl-9 appearance-none outline-none "
              >
                {actions.map(action => (
                  <option key={action} value={action}>
                    {action === 'all' ? 'All Actions' : action}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logs List */}
      <div className="card bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Activity Log</h3>
          <p className="text-sm text-gray-500">{filteredLogs.length} entries</p>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action.includes('Reserved') ? 'bg-blue-100 text-blue-700' :
                        log.action.includes('Cancelled') ? 'bg-red-100 text-red-700' :
                        log.action.includes('Approved') ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{log.user}</span>
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">{log.details}</p>
                  </div>
                  <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;