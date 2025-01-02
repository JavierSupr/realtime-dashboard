import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-xl font-bold">
            Traffic Monitor
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive(
                '/'
              )}`}
            >
              Live Stream
            </Link>
            <Link
              to="/violations"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive(
                '/violations'
              )}`}
            >
              Violations
            </Link>
            <Link
              to="/stats"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive(
                '/stats'
              )}`}
            >
              Statistics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;