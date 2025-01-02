import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViolationsList() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/violations');
        setViolations(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
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
      <h1 className="text-3xl font-bold text-gray-900">Traffic Violations</h1>
      <div className="grid gap-4">
        {violations.map((violation) => (
          <Link
            key={violation._id}
            to={`/violation/${violation._id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {violation.licensePlate}
                </h2>
                <p className="text-gray-600">
                  {new Date(violation.timestamp).toLocaleString()}
                </p>
                <p className="text-gray-700">Camera: {violation.camera}</p>
              </div>
              <div className="text-blue-600 font-medium">
                View Details →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ViolationsList;