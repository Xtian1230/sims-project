
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import BgImage from "../../assets/BgImage.jpg";

const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Reports = () => {
  return (
    <div style={BgStyle} className="min-h-screen overflow-hidden">
      <div className="min-h-screen bg-white/60 backdrop-blur-md p-10 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-black mb-12">Sales Reports</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {["Nagcarlan", "Rizal", "San Pablo"].map((location) => (
            <div
              key={location}
              className="bg-yellow-100 rounded-lg shadow-lg p-6 text-center"
            >
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">{location}</h2>
              <p className="text-gray-700 mb-6">Reports for {location}</p>
              {/* Navigate to the DailyReport page */}
              <Link
                to={`/dashboard/reports/daily/${location}`}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg inline-block mb-2 hover:bg-yellow-700 transition-all"
              >
                View Daily Report
              </Link>
              {/* Navigate to the WeeklyReport page */}
              <Link
                to={`/dashboard/reports/weekly/${location}`}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-gray-700 transition-all"
              >
                View Weekly Report
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
