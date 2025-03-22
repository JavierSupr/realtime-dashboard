import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViolationsList() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  const totalPages = Math.ceil(violations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = violations.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
        {currentItems.map((violation) => (
          <Link
            key={violation._id}
            to={`/violation/${violation._id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {violation.license_plate}
                </h2>
                <p className="text-gray-600">
                {new Date(violation.timestamp).toISOString().replace("T", " ").split(".")[0]}
                </p>
                <p className="text-gray-700">Camera: {violation.camera}</p>
              </div>
              <div className="text-blue-600 font-medium">View Details →</div>
            </div>
          </Link>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ViolationsList;
