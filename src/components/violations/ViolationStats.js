import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViolationStats() {
  const [stats, setStats] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/violations/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Violation Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Daily Violations
          </h2>
          <p className="text-4xl font-bold text-blue-600">{stats.daily}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Weekly Violations
          </h2>
          <p className="text-4xl font-bold text-blue-600">{stats.weekly}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Monthly Violations
          </h2>
          <p className="text-4xl font-bold text-blue-600">{stats.monthly}</p>
        </div>
      </div>
    </div>
  );
}

export default ViolationStats;