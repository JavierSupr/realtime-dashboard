import React from 'react';

function LiveStream() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Live CCTV Stream</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Camera 1</h2>
          </div>
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <span className="text-white text-lg">Live Stream Placeholder</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Camera 2</h2>
          </div>
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <span className="text-white text-lg">Live Stream Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveStream;