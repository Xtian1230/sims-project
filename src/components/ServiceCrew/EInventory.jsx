// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase/firebaseConfig.js';
import BgImage from '../../assets/BgImage.jpg';
import { collection, getDocs, query, where } from "firebase/firestore";

const initialInventoryData = [
  { item: "Buns", price: 5.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "HD Buns", price: 5.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "FL Buns", price: 12.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Patty", price: 15.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "FL Dog", price: 44.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Hung. Chiz", price: 65.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Cheese", price: 5.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Chori Patty", price: 22.50, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Bacon", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Cheesy HD", price: 13.50, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Egg", price: 15.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Mineral", price: 16.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Red Tea", price: 35.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "M. Dew PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Pepsi PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "7Up PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Miranda PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Rootbeer PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Tropicana PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Sting PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
  { item: "Gatorade PET", price: 25.00, nagcarlan: 0, rizal: 0, sanPablo: 0 },
];

const EInventory = () => {
  const [inventory, setInventory] = useState(initialInventoryData);
  const [selectedLocation, setSelectedLocation] = useState('nagcarlan');
  const [currentDate, setCurrentDate] = useState('');
  const [setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    fetchInventoryData();
  }, [selectedLocation]);

  const fetchInventoryData = async () => {
    try {
      const inventoryQuery = query(collection(db, "inventory"), where("location", "==", selectedLocation));
      const querySnapshot = await getDocs(inventoryQuery);
      const fetchedData = querySnapshot.docs.map(doc => doc.data());

      const updatedInventory = inventory.map(item => {
        const fetchedItem = fetchedData.find(data => data.item === item.item);
        return fetchedItem
          ? { ...item, [selectedLocation]: fetchedItem.quantity }
          : item;
      });

      setInventory(updatedInventory);
    } catch (error) {
      console.error("Error fetching inventory data:", error.code, error.message, error);
      setNotification({ message: "Failed to load inventory data. Please try again.", type: "error" });
    }
  };

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  const calculateTotalPrice = (quantity, price) => quantity * price;

  const calculateGrandTotal = () => {
    return inventory.reduce((total, item) => {
      const quantity = selectedLocation === 'nagcarlan' ? item.nagcarlan
        : selectedLocation === 'rizal' ? item.rizal
          : item.sanPablo;
      return total + calculateTotalPrice(quantity, item.price);
    }, 0);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="bg-white/90 rounded-lg shadow-lg backdrop-blur-md p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-black text-center mb-6">Inventory</h1>
        <p className="text-black font-medium text-lg mb-6 text-right">Date: {currentDate}</p>

        <div className="flex items-center justify-start mb-6">
          <label htmlFor="location" className="text-gray-800 font-medium text-lg mr-4">
            Select Location:
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition duration-150 ease-in-out"
          >
            <option value="nagcarlan">Nagcarlan</option>
            <option value="rizal">Rizal</option>
            <option value="sanPablo">San Pablo</option>
          </select>
        </div>

        {/* Grand Total */}
        <div className="flex justify-center lg:justify-start mb-6 bg-yellow-100 p-4 rounded-lg shadow-md">
          <span className="text-lg font-semibold text-gray-700 mr-2">Grand Total Price:</span>
          <span className="text-xl font-bold text-yellow-600">{calculateGrandTotal()}</span>
        </div>


        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-yellow-300 text-gray-700">
                <th className="px-4 py-3 border-b border-gray-300 text-left font-semibold">Items</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left font-semibold">Price</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left font-semibold">Quantity</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left font-semibold">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => {
                const quantity = selectedLocation === 'nagcarlan' ? item.nagcarlan
                  : selectedLocation === 'rizal' ? item.rizal
                    : item.sanPablo;
                const totalPrice = calculateTotalPrice(quantity, item.price);
                return (
                  <tr key={index} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                    <td className="px-4 py-3 border-b border-gray-300 text-gray-700">{item.item}</td>
                    <td className="px-4 py-3 border-b border-gray-300 text-gray-700">{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 border-b border-gray-300 text-gray-700">{quantity}</td>
                    <td className="px-4 py-3 border-b border-gray-300 text-gray-700">{totalPrice.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EInventory;
