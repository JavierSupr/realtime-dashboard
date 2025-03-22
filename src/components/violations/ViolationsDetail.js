import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ViolationDetail() {
  const { id } = useParams();
  const [violation, setViolation] = useState(null);
  const [mainImageSrc, setMainImageSrc] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViolation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/violations/${id}`);
        setViolation(response.data);

        // Fetch main image if violationImageId exists
        if (response.data.violationImageId) {
          const mainImage = await fetchImage(response.data.violationImageId);
          setMainImageSrc(mainImage);
        }

        // Fetch additional camera images
        if (response.data.additional_cameras && response.data.additional_cameras.length > 0) {
          const imagePromises = response.data.additional_cameras
            .filter(camera => camera.violationImageId)
            .map(camera => fetchImage(camera.violationImageId));
          
          const additionalImageUrls = await Promise.all(imagePromises);
          setAdditionalImages(additionalImageUrls);
        }
      } catch (error) {
        console.error('Error fetching violation:', error);
        setError('Failed to load violation data');
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async (imageId) => {
      try {
        const imageResponse = await axios.get(
          `http://localhost:5000/api/violations/image/${imageId}`,
          { responseType: "blob" }
        );
        
        return URL.createObjectURL(imageResponse.data);
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    };

    fetchViolation();

    // Cleanup function to revoke object URLs
    return () => {
      if (mainImageSrc) {
        URL.revokeObjectURL(mainImageSrc);
      }
      additionalImages.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
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
                    {violation.license_plate}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Location:</dt>
                  <dd className="font-medium text-gray-900">
                    {violation.location}
                  </dd>
                </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Date:</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(violation.timestamp).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Time:</dt>
                <dd className="font-medium text-gray-900">
                {new Date(violation.timestamp).toLocaleTimeString('en-US', { 
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false 
                  })}
                </dd>
              </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Main Camera:</dt>
                  <dd className="font-medium text-gray-900">{violation.camera}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Height:</dt>
                  <dd className="font-medium text-gray-900">
                    {violation.height.toFixed(2)} m
                  </dd>
                </div>
              </dl>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Additional Camera Data
              </h2>
              {violation.additional_cameras && violation.additional_cameras.length > 0 ? (
                <div className="space-y-2">
                  {violation.additional_cameras.map((camera, index) => (
                      <dl className="space-y-2" key={index}>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Camera:</dt>
                          <dd className="font-medium text-gray-900">{camera.camera}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Height:</dt>
                          <dd className="font-medium text-gray-900">{camera.height.toFixed(2)} m</dd>
                        </div>
                      </dl>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No additional camera data available</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Violation Images
            </h2>

            {/* Images container - will be side-by-side on larger screens, stacked on smaller screens */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Image */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Primary Camera</h3>
                {mainImageSrc ? (
                  <img
                    src={mainImageSrc}
                    alt="Primary Violation"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="flex justify-center items-center h-64 w-full bg-gray-100 rounded-lg">
                    <p className="text-gray-600">No main image available</p>
                  </div>
                )}
              </div>

              {/* Additional Image (if available) */}
              {violation.additional_cameras && violation.additional_cameras.length > 0 && additionalImages[0] && (
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Additional Camera</h3>
                  <img
                    src={additionalImages[0]}
                    alt="Additional Violation"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* If there are more than one additional images, display them below */}
            {violation.additional_cameras && 
             violation.additional_cameras.length > 1 && 
             additionalImages.length > 1 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">More Camera Views</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {additionalImages.slice(1).map((imgSrc, index) => (
                    imgSrc && (
                      <div key={index + 1}>
                        <img
                          src={imgSrc}
                          alt={`Additional Violation ${index + 2}`}
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViolationDetail;