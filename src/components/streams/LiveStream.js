import React, { useEffect, useRef, useState } from 'react';

const LiveStream = () => {
  const frame1Ref = useRef(null);
  const frame2Ref = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8765');

        wsRef.current.onopen = () => {
          console.log('WebSocket Connected');
          setIsConnected(true);
          setError(null);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received WebSocket message:", data);
            wsRef.current.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data.type === 'frame') {
                  if (data.camera === 'Camera 1' && frame1Ref.current) {
                    frame1Ref.current.src = `data:image/jpeg;base64,${data.data}`;
                  } else if (data.camera === 'Camera 2' && frame2Ref.current) {
                    frame2Ref.current.src = `data:image/jpeg;base64,${data.data}`;
                  }
                }
              } catch (e) {
                console.error('Error processing message:', e);
              }
            };
            if (data.type === 'frame') {
              if (data.camera === 'Camera 1' && frame1Ref.current) {
                frame1Ref.current.src = `data:image/jpeg;base64,${data.data}`;
              } else if (data.camera === 'Camera 2' && frame2Ref.current) {
                frame2Ref.current.src = `data:image/jpeg;base64,${data.data}`;
              }
            }
          } catch (e) {
            console.error('Error processing message:', e);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setError('Failed to connect to video stream');
          setIsConnected(false);
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket Disconnected');
          setIsConnected(false);
          // Try to reconnect
          setTimeout(connectWebSocket, 1000);
        };
      } catch (e) {
        console.error('Error creating WebSocket:', e);
        setError('Failed to create WebSocket connection');
        setTimeout(connectWebSocket, 1000);
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Live CCTV Stream</h1>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Camera 1</h2>
          </div>
          <div className="aspect-video bg-gray-800 relative">
            <img
              ref={frame1Ref}
              alt="Camera 1"
              className="w-full h-full object-contain"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Connecting to stream...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Camera 2</h2>
          </div>
          <div className="aspect-video bg-gray-800 relative">
            <img
              ref={frame2Ref}
              alt="Camera 2"
              className="w-full h-full object-contain"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Connecting to stream...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;