// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { db } from '../../Firebase/firebaseConfig.js'; // Firestore config
import { collection, getDocs, query, where } from 'firebase/firestore';
import BgImage from '../../assets/BgImage.jpg'; // Import background image

const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

// Helper functions
const formatDate = (date) => {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

const formatDayWithDate = (date) => {
  const options = { weekday: 'long', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

const SalesChart = () => {
  const [selectedBranch, setSelectedBranch] = useState('San Pablo');
  const [selectedDate, setSelectedDate] = useState('2024-11-01'); // Default date
  const [chartData, setChartData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('7Up PET');
  const [dates, setDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState('weekly'); // Toggle between "weekly" and "monthly"
  const branches = ['Nagcarlan', 'Rizal', 'San Pablo'];
  const items = [
    'Buns', 'HD Buns', 'FL Buns', 'Patty', 'FL Dog', 'Hung. Chiz',
    'Chori Patty', 'Cheese', 'Bacon', 'Cheesy HD', 'Egg', 'Mineral',
    'Red Tea', 'M. Dew PET', 'Pepsi PET', '7Up PET', 'Mirinda PET',
    'Sting PET', 'Tropicana PET', 'Rootbeer PET', 'Gatorade PET',
  ];

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'weeklyReports'));
        const uniqueDates = new Set();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.date) uniqueDates.add(data.date);
        });

        setDates([...uniqueDates].sort()); // Ensure dates are sorted
      } catch (error) {
        console.error('Error fetching dates:', error);
        setErrorMessage('Failed to fetch available dates.');
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setErrorMessage(''); // Reset error message
      try {
        const reportsQuery = query(
          collection(db, 'weeklyReports'),
          where('branch', '==', selectedBranch)
        );
        const snapshot = await getDocs(reportsQuery);
        const data = snapshot.docs.map((doc) => doc.data());

        if (viewMode === 'weekly' && data.length > 0) {
          const itemData = data[0].items[selectedItem];
          if (!itemData) {
            setErrorMessage(`No sales data found for ${selectedItem}`);
            setChartData([]);
            return;
          }

          const transformedData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
            day,
            AM: itemData[`${day}AM`] || 0,
            PM: itemData[`${day}PM`] || 0,
          }));
          setChartData(transformedData);
        } else if (viewMode === 'monthly') {
          const groupedData = [];
          data.forEach((entry) => {
            const { date, items } = entry;
            if (!items[selectedItem]) return;

            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach((day) => {
              const amKey = `${day}AM`;
              const pmKey = `${day}PM`;
              if (items[selectedItem][amKey] || items[selectedItem][pmKey]) {
                groupedData.push({
                  day: formatDayWithDate(date),
                  AM: items[selectedItem][amKey] || 0,
                  PM: items[selectedItem][pmKey] || 0,
                });
              }
            });
          });

          const sortedData = groupedData.sort((a, b) => new Date(a.day) - new Date(b.day));
          setChartData(sortedData);
        } else {
          setErrorMessage('No data found for the selected branch and date.');
          setChartData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('An error occurred while fetching data.');
        setChartData([]);
      }
    };

    if (selectedBranch) fetchData();
  }, [selectedBranch, selectedDate, selectedItem, viewMode]);

  return (
    <div style={BgStyle} className="min-h-screen">
      <div className="min-h-screen bg-white/70 backdrop-blur-md p-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-900 mb-6">Sales Reports</h1>

        {/* Branch, Date, Item, and View Mode Selectors */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Branch:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {viewMode === 'weekly' && (
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Date:</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Item:</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">View Mode:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {viewMode === 'weekly' ? 'Weekly Sales Chart' : 'Monthly Sales Chart'}
          </h2>
          <div className="mt-6">
            {errorMessage ? (
              <p className="text-red-600 text-center">{errorMessage}</p>
            ) : (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", dy: 10 }} />
                    <YAxis label={{ value: "Sales Amount", angle: -90, position: "insideLeft", dx: -10 }} />
                    <Tooltip />
                    <Legend />
                    {/* Individual Bars for AM and PM Sales */}
                    <Bar dataKey="AM" fill="#8884d8" name="Morning Sales" />
                    <Bar dataKey="PM" fill="#82ca9d" name="Evening Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
