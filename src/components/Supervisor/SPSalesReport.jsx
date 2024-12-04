
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BgImage from '../../assets/BgImage.jpg';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import { db } from '../../Firebase/firebaseConfig';
import { collection, query, getDocs, where, addDoc , doc, setDoc} from 'firebase/firestore';

const SPSalesReport = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [shift, setShift] = useState('day');
  const [items, setItems] = useState([
    { name: "Buns", price: 5.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "HD Buns", price: 5.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "FL Buns", price: 12.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Patty", price: 15.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "FL Dog", price: 44.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Hung. Chiz", price: 65.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Chori Patty", price: 22.50, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Cheese", price: 5.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Bacon", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Cheesy HD", price: 13.50, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Egg", price: 15.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Mineral", price: 16.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Red Tea", price: 35.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "M. Dew PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Pepsi PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "7Up PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Mirinda PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Sting PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Tropicana PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Rootbeer PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
    { name: "Gatorade PET", price: 25.00, starting: 0, delivery: 0, waste: 0, ending: 0, sold: 0, sales: 0 },
  ]);

  const [cashBreakdown, setCashBreakdown] = useState([
    { denomination: 1000, quantity: 0, P: 0 },
    { denomination: 500, quantity: 0, P: 0 },
    { denomination: 200, quantity: 0, P: 0 },
    { denomination: 100, quantity: 0, P: 0 },
    { denomination: 50, quantity: 0, P: 0 },
    { denomination: 20, quantity: 0, P: 0 },
    { denomination: "Coins", quantity: 0, P: 0 },
  ]);

  const [summary, setSummary] = useState({
    totalSales: 0,
    expenses: 0,
    seniorDiscount: 0,
    cashOnHand: 0,
    serialNumbers: "",
  });

  const [crew, setCrew] = useState({
    outgoingCrew: "",
    IncomingCrew: "",
  })

  const [dnwbtl, setdnwdtl] = useState({
    commission: 0,
    short: 0,
    over: 0,
  })

  const [condiments, setCondiments] = useState([
    { name: "Mayonnaise", starting: 0, closing: 0 },
    { name: "Catsup", starting: 0, closing: 0 },
    { name: "Hot Sauce", starting: 0, closing: 0 },
    { name: "Oil", starting: 0, closing: 0 },
  ]);

  const [lpg, setLpg] = useState([
    { type: "Full", starting: 0, closing: 0 },
    { type: "Empty", starting: 0, closing: 0 },
  ]);


  const abProducts = ["Buns", "HD Buns", "FL Buns", "Patty", "FL Dog", "Hung. chiz", "Chorri Patty", "Cheese", "Bacon", "Cheesy HD", "Egg", "Mineral", "Red Tea"];
  const pepsiProducts = ["M. Dew PET", "Pepsi PET", "7Up PET", "Mirinda PET", "Sting PET", "Tropicana PET", "Rootbeer PET", "Gatorade PET"];

  const calculateSubtotal = (productNames) =>
    items
      .filter((item) => productNames.includes(item.name))
      .reduce((total, item) => total + item.sold * item.price, 0);

  useEffect(() => {
    const totalSales = items.reduce((sum, item) => sum + item.sales, 0);
    setSummary((prevSummary) => ({
      ...prevSummary,
      totalSales,
    }));
  }, [items]);


  useEffect(() => {
    // Get the logged-in user's uid from Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userUid = user.uid;

      // Query the employees collection to get the user's full name based on uid
      const getUserData = async () => {
        try {
          const employeesRef = collection(db, 'employees');
          const employeeQuery = query(employeesRef, where('uid', '==', userUid));
          const querySnapshot = await getDocs(employeeQuery);

          if (!querySnapshot.empty) {
            const employeeData = querySnapshot.docs[0].data();
            setName(employeeData.fullName); // Set the user's full name
            setBranches(employeeData.branches);
          } else {
            console.error('No employee found for the current user.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      };

      getUserData();
    } else {
      console.error('No user is logged in.');
    }
  }, []);

  const handleCondimentChange = (index, field, value) => {
    const updatedCondiments = [...condiments];
    updatedCondiments[index][field] = parseInt(value) || 0;
    setCondiments(updatedCondiments);
  };

  const handleLpgChange = (index, field, value) => {
    const updatedLpg = [...lpg];
    updatedLpg[index][field] = parseInt(value) || 0;
    setLpg(updatedLpg);
  };

  const handleCashBreakdownChange = (index, value) => {
    const updatedCashBreakdown = [...cashBreakdown];
    updatedCashBreakdown[index].quantity = parseInt(value) || 0;
    setCashBreakdown(updatedCashBreakdown);
  };

  const calculateTotal = () => {
    return cashBreakdown.reduce((total, item) => {
      const amount = item.denomination === "Coins" ? item.quantity : item.denomination * item.quantity;
      return total + amount;
    }, 0);
  };

  const calculateCashBreakdown = () => {
    setCashBreakdown((prevCashBreakdown) =>
      prevCashBreakdown.map((item) => ({
        ...item,
        P: item.denomination === "Coins" ? item.quantity : item.denomination * item.quantity,
      }))
    );
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];  // Ensure this is declared before usage
    updatedItems[index][field] = parseFloat(value) || 0;  // Parse the input as a number

    // If the 'sold' field is updated, recalculate the sales
    if (field === "sold") {
      updatedItems[index].sales = updatedItems[index].sold * updatedItems[index].price;
    }

    setItems(updatedItems);  // Update the state with the new item data
  };

  const handleInputTotal = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = parseFloat(value) || 0;

    // Recalculate total for the week
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const total = days.reduce((sum, day) => {
      const amValue = updatedItems[index][`${day}AM`] || 0;
      const pmValue = updatedItems[index][`${day}PM`] || 0;
      return sum + amValue + pmValue;
    }, 0);

    updatedItems[index].total = total;

    setItems(updatedItems);
  };

  const TableInput = ({ value, onChange }) => (
    <input
      type="number"
      className="border px-2 py-1 w-full"
      value={value}
      onChange={onChange}
    />
  );

  TableInput.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
  };


  const handleSubmit = async () => {
    // Helper function to check for negative values, excluding items or other expected fields
    const hasNegativeValue = (data) => {
      for (const key in data) {
        // Skip items and other fields where negative values are allowed
        if (key === 'items') {
          continue;
        }

        if (typeof data[key] === 'number' && data[key] < 0) {
          return true;
        } else if (Array.isArray(data[key])) {
          // If it's an array (like condiments or cashBreakdown), check each object inside it
          for (const item of data[key]) {
            if (typeof item === 'object') {
              if (hasNegativeValue(item)) {
                return true;
              }
            } else if (typeof item === 'number' && item < 0) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Prepare data
    calculateCashBreakdown();

    const abSubtotal = calculateSubtotal(abProducts); // Replace abProducts with actual data
    const pepsiSubtotal = calculateSubtotal(pepsiProducts); // Replace pepsiProducts with actual data

    const data = {
      name, // Ensure `name` is declared and defined elsewhere
      date, // Ensure `date` is declared and defined elsewhere
      branch: selectedBranch, // Ensure `selectedBranch` is declared
      shift, // Ensure `shift` is declared
      items, // Ensure `items` is declared
      subtotals: {
        abProducts: abSubtotal,
        pepsiProducts: pepsiSubtotal,
      },
      condiments, // Ensure `condiments` is declared
      lpg, // Ensure `lpg` is declared
      cashBreakdown, // Ensure `cashBreakdown` is declared
      summary, // Ensure `summary` is declared
      crew,
      dnwbtl,
      timestamp: moment().format("MM-DD-YYYY HH:mm:ss"), // Add timestamp
    };

    // Validate for negative values (excluding items)
    if (hasNegativeValue(data)) {
      alert("Negative values are not allowed. Please check the input fields.");
      return;
    }

    // Proceed with submitting the data if no negative values are found
    try {
      const docRef = await addDoc(collection(db, "dailyreport"), data);
      alert(`Sales report saved successfully! Document ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error saving report: ", error);
      alert("Failed to save report. Please try again.");
    }
  };

  const saveWeeklyReport = async () => {
    const hasNegativeValue = (dataToSave) => {
      for (const key in dataToSave) {
        // Skip items and other fields where negative values are allowed
        if (key === 'items') {
          continue;
        }

        if (typeof dataToSave[key] === 'number' && dataToSave[key] < 0) {
          return true;
        } else if (Array.isArray(dataToSave[key])) {
          // If it's an array (like condiments or cashBreakdown), check each object inside it
          for (const item of dataToSave[key]) {
            if (typeof item === 'object') {
              if (hasNegativeValue(item)) {
                return true;
              }
            } else if (typeof item === 'number' && item < 0) {
              return true;
            }
          }
        }
      }
      return false;
    };
    // Prepare data for Firestore
    const dataToSave = {
      branch: selectedBranch || "N/A", // Default to "N/A" if no branch is selected
      date: date || "N/A", // Default to "N/A" if no date is selected
      items: items.reduce((acc, item) => {
        const { name, total, ...dayValues } = item;

        // Sanitize day values (default to 0 if undefined)
        const sanitizedDayValues = Object.fromEntries(
          Object.entries(dayValues).map(([key, value]) => [key, value || 0])
        );

        acc[name || "Unnamed Item"] = {
          ...sanitizedDayValues,
          Total: total || 0, // Include total value for each item
        };

        return acc;
      }, {}),
      timestamp: moment().format("MM-DD-YYYY HH:mm:ss"), // Add timestamp
    };

    // Validate for negative values (excluding items)
    if (hasNegativeValue(dataToSave)) {
      alert("Negative values are not allowed. Please check the input fields.");
      return;
    }

    try {
      // Generate unique document ID using branch and date
      const docId = `${dataToSave.branch}_${dataToSave.date}`;

      // Save data to Firestore under 'weeklyReports' collection
      await setDoc(doc(db, "weeklyReports", docId), dataToSave);

      alert("Report successfully submitted!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save report. Please try again.");
    }
  };

  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  const toggleWeeklyReport = () => setShowWeeklyReport(!showWeeklyReport);

  const renderWeeklyReportTable = () => (
    <div className="overflow-x-auto mt-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
        Sold Items - Daily Monitoring Sheets
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="font-semibold">Branch:</label>
          <select
            className="border border-gray-300 px-2 py-1 rounded mb-2"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Date:</label>
          <input
            type="date"
            className="border border-gray-300 px-2 py-1 rounded mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-auto border-collapse border rounded-lg shadow-md">
          <thead>
            <tr className="bg-yellow-500 text-white">
              <th rowSpan="2" className="border p-2 text-center font-semibold">
                Items
              </th>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <th colSpan="2" key={day} className="border p-2 text-center font-semibold">
                  {day}
                </th>
              ))}
              <th rowSpan="2" className="border p-2 text-center font-semibold">
                Total
              </th>
            </tr>
            <tr className="bg-yellow-300">
              {Array.from({ length: 7 }).map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border p-1 text-center font-medium">AM</th>
                  <th className="border p-1 text-center font-medium">PM</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="odd:bg-gray-50 even:bg-gray-100">
                <td className="border p-2 text-center font-medium text-gray-700">{item.name}</td>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <React.Fragment key={day}>
                    <td className="border p-1">
                      <input
                        type="number"
                        name={`item-${index}-${day}-AM`}
                        value={item[`${day}AM`] || ""}
                        onChange={(e) => handleInputTotal(index, `${day}AM`, e.target.value)}
                        className="border border-gray-300 px-3 py-1 text-sm rounded-md w-16 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        type="number"
                        name={`item-${index}-${day}-PM`}
                        value={item[`${day}PM`] || ""}
                        onChange={(e) => handleInputTotal(index, `${day}PM`, e.target.value)}
                        className="border border-gray-300 px-3 py-1 text-sm rounded-md w-16 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                      />
                    </td>
                  </React.Fragment>
                ))}
                <td className="border p-2 text-center font-semibold text-gray-800">
                  {item.total || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => saveWeeklyReport()}
          className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        >
          Send Weekly Report
        </button>
      </div>
    </div>

  );

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="bg-white/80 backdrop-blur-lg p-6 w-full max-w-5xl mx-auto rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Sales Report</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="font-semibold">Name:</label>
            <input type="text" className="border border-gray-300 px-2 py-1 rounded" value={name} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Date:</label>
            <input
              type="date"
              className="border border-gray-300 px-2 py-1 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Branch:</label>
            <select
              className="border border-gray-300 px-2 py-1 rounded"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Shift:</label>
            <select
              className="border border-gray-300 px-2 py-1 rounded"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        <table className="table-auto w-full mt-6 text-center border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className=" bg-yellow-300 text-gray-700">
              <th>ITEMS</th><th>STARTING</th><th>DELIVERY</th><th>WASTE</th><th>ENDING</th><th>SOLD</th><th>PRICE</th><th>SALES</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                {["starting", "delivery", "waste", "ending", "sold"].map((field) => (
                  <td key={field} className="p-2">
                    <TableInput
                      value={item[field]}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                    />
                  </td>
                ))}
                <td className="p-2">{item.price.toFixed(2)}</td>
                <td className="p-2">{item.sales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center">
            <label className="font-semibold mr-4">Subtotal for AB Products:</label>
            <input
              type="number"
              value={calculateSubtotal(abProducts)}
              readOnly
              className="border px-2 py-1 rounded bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex items-center">
            <label className="font-semibold mr-4">Subtotal for Pepsi Products:</label>
            <input
              type="number"
              value={calculateSubtotal(pepsiProducts)}
              readOnly
              className="border px-2 py-1 rounded bg-gray-100 text-gray-800"
            />
          </div>
        </div>


        <h2 className="text-xl font-bold mt-8">Condiments</h2>
        <table className="table-auto w-full mt-2 text-center border border-gray-200">
          <thead>
            <tr className="bg-yellow-300 text-gray-700">
              <th>CONDIMENTS</th>
              <th>STARTING</th>
              <th>CLOSING</th>
            </tr>
          </thead>
          <tbody>
            {condiments.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 w-full rounded"
                    value={item.starting}
                    onChange={(e) => handleCondimentChange(index, "starting", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 w-full rounded"
                    value={item.closing}
                    onChange={(e) => handleCondimentChange(index, "closing", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-bold mt-8">LPG</h2>
        <table className="table-auto w-full mt-2 text-center border border-gray-200">
          <thead>
            <tr className="bg-yellow-300 text-gray-700">
              <th>LPG</th>
              <th>STARTING</th>
              <th>CLOSING</th>
            </tr>
          </thead>
          <tbody>
            {lpg.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{item.type}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 w-full rounded"
                    value={item.starting}
                    onChange={(e) => handleLpgChange(index, "starting", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 w-full rounded"
                    value={item.closing}
                    onChange={(e) => handleLpgChange(index, "closing", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-bold mt-8">Cash Breakdown</h2>
        <table className="table-auto w-full mt-2 text-center border border-gray-200">
          <thead>
            <tr className="bg-yellow-300 text-gray-700">
              <th>DENOMINATION</th>
              <th>QUANTITY</th>
              <th>= P</th>
            </tr>
          </thead>
          <tbody>
            {cashBreakdown.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{item.denomination}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 w-full rounded"
                    value={item.quantity}
                    onChange={(e) => handleCashBreakdownChange(index, e.target.value)}
                  />
                </td>
                <td className="p-2">
                  {item.denomination === "Coins"
                    ? item.quantity
                    : item.denomination * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-lg font-semibold text-gray-800">
          Total Cash: P {calculateTotal()}
        </div>

        <h2 className="text-xl font-bold mt-8 text-center">Summary</h2>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="font-semibold">Total Sales:</label>
            <input type="number" className="border border-gray-300 px-2 py-1 rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Expenses:</label>
            <input type="number" className="border border-gray-300 px-2 py-1 rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Senior Discount:</label>
            <input type="number" className="border border-gray-300 px-2 py-1 rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Cash on Hand:</label>
            <input type="number" className="border border-gray-300 px-2 py-1 rounded" />
          </div>
        </div>
        <div className="mt-4">
          <label className="font-semibold">Write the Serial Numbers:</label>
          <textarea className="border px-2 py-1 w-full mt-2" />
        </div>

        <h3 className="text-lg font-bold mt-8 text-center">ITO AY PATUNAY NA LAHAT NG DETALYE AT PERA NA NAKASAAD SA REPORT NA ITO AY WASTO AT KUMPLETO</h3>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="flex flex-col">
            <textarea className="border border-gray-300 px-2 py-1 rounded mb-2" />
            <label className="font-semibold text-center mb-4">OUTGOING CREW</label>
          </div>
          <div className="flex flex-col">
            <textarea className="border border-gray-300 px-2 py-1 rounded mb-2" />
            <label className="font-semibold text-center mb-4">INCOMING CREW</label>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h4 className="text-xl font-bold text-center text-gray-800 mb-6">***Do not write below this line***</h4>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Commission:</label>
              <input type="number" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Short:</label>
              <input type="number" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">Over:</label>
              <input type="number" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleSubmit("daily")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Send Sales Report
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={toggleWeeklyReport}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:outline-none"
          >
            {showWeeklyReport ? "Hide Weekly Report" : "Weekly Report"}
          </button>
        </div>

        {showWeeklyReport && renderWeeklyReportTable()}
      </div>
    </div>
  );
};

export default SPSalesReport;
