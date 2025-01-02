import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import LiveStream from './components/streams/LiveStream';
import ViolationsList from './components/violations/ViolationsList';
import ViolationStats from './components/violations/ViolationStats';
import ViolationDetail from './components/violations/ViolationsDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LiveStream />} />
            <Route path="/violations" element={<ViolationsList />} />
            <Route path="/stats" element={<ViolationStats />} />
            <Route path="/violation/:id" element={<ViolationDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;