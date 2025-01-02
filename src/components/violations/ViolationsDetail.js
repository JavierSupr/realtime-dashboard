import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ViolationDetail() {
  const { id } = useParams();
  const [violation, setViolation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/violations/${id}`);
        setViolation(response.data);
      } catch (error) {
        console.error('Error fetching violation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchViolation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Violation not found
        </h2>
        <Link
          to="/violations"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to violations list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Violation Detail</h1>
        <Link
          to="/violations"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to list
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vehicle Information
              </h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">License Plate:</dt>
                  <dd className="font-medium text-gray-900">
                    {violation.licensePlate}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Time:</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(violation.timestamp).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Camera:</dt>
                  <dd className="font-medium text-gray-900">{violation.camera}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Dimensions:</dt>
                  <dd className="font-medium text-gray-900">
                    {violation.length}m x {violation.width}m
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Violation Image
            </h2>
            <img
              src={violation.violationImage || '/placeholder.jpg'}
              alt="Violation"
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViolationDetail;