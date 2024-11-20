// eslint-disable-next-line no-unused-vars
import React from 'react';
import BgImage from '../../assets/BgImage.jpg';

const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const EDashboard = () => {
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={BgStyle} className="min-h-screen overflow-hidden">
      <div className="min-h-screen bg-white/60 backdrop-blur-md p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-black mb-2">Service Crew Dashboard</h1>
        <p className="text-lg text-gray-700">{formattedDate}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
          {/* Today's Sales Card */}
          <div className="bg-yellow-300 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
            <h2 className="text-2xl font-semibold text-gray-800">Today&apos;s Sales</h2>
            <p className="text-3xl font-bold text-gray-900">PHP 10,000</p>
            <p className="text-gray-600">Total sales amount for today</p>
          </div>

          {/* Orders Completed Card */}
          <div className="bg-yellow-300 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
            <h2 className="text-2xl font-semibold text-gray-800">Orders Completed</h2>
            <p className="text-3xl font-bold text-gray-900">150</p>
            <p className="text-gray-600">Orders completed today</p>
          </div>

          {/* Inventory Performance Card */}
          <div className="bg-yellow-300 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
            <h2 className="text-2xl font-semibold text-gray-800">Inventory Performance</h2>
            <p className="text-3xl font-bold text-gray-900">Good</p>
            <p className="text-gray-600">Status of today&apos;s inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDashboard;
