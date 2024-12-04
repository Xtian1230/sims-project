// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import BgImage from '../../assets/BgImage.jpg';
import { db } from '../../Firebase/firebaseConfig.js';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const SPSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [shiftTime, setShiftTime] = useState('Day');
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('');
  const [scheduleList, setScheduleList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editShiftId, setEditShiftId] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [events, setEvents] = useState([]);
  const [dateError, setDateError] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); // Notification state

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000); // Set to 5 seconds for testing
  };

  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch the logged-in user's full name
  useEffect(() => {
    const fetchCurrentUserName = async () => {
      if (!currentUserId) return;
      const employeesRef = collection(db, 'employees');
      const currentUserSnapshot = await getDocs(query(employeesRef, where("uid", "==", currentUserId)));
      if (!currentUserSnapshot.empty) {
        const currentUserData = currentUserSnapshot.docs[0].data();
        setCurrentUserName(currentUserData.fullName);
      }
    };

    fetchCurrentUserName();
  }, [currentUserId]);

  // Fetch all scheduled shifts and format them for the calendar
  useEffect(() => {
    const fetchAllocatedShifts = () => {
      const shiftsRef = collection(db, 'shifts');
      onSnapshot(shiftsRef, (snapshot) => {
        const shifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScheduleList(shifts);

        const calendarEvents = shifts.map(shift => ({
          title: `${shift.name} - ${shift.location}`,
          start: new Date(shift.date),
          end: new Date(shift.date),
          allDay: true,
          color: shift.name === currentUserName ? 'yellow' : 'default' // Highlight current user's shifts
        }));
        setEvents(calendarEvents);
      });
    };

    fetchAllocatedShifts();
  }, [currentUserName]);

  // Function to style the events
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color === 'yellow' ? '#FFD700' : '#3174ad', // Use yellow for highlighted events
        color: 'white',
      }
    };
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const currentDate = moment().format('YYYY-MM-DD');

    if (selected < currentDate) {
      setDateError('You cannot select a past date.');
      setSelectedDate('');
    } else {
      setDateError('');
      setSelectedDate(selected);
    }
  };

  const fetchEmployeesWithMatchingBranches = async (currentUserId) => {
    if (!currentUserId) return;
    try {
      const employeesRef = collection(db, 'employees');
      const currentUserSnapshot = await getDocs(query(employeesRef, where("uid", "==", currentUserId)));
      if (currentUserSnapshot.empty) return;

      const currentUserData = currentUserSnapshot.docs[0].data();
      const currentUserBranches = currentUserData.branches || [];
      const currentUserFullName = currentUserData.fullName;

      if (currentUserBranches.length > 0) {
        setLocationOptions(currentUserBranches);
      }

      const serviceCrewSnapshot = await getDocs(query(employeesRef, where("role", "==", "Service Crew")));
      const employeeList = [];
      serviceCrewSnapshot.forEach(doc => {
        const employeeData = doc.data();
        if (employeeData.branches && employeeData.branches.some(branch => currentUserBranches.includes(branch))) {
          employeeList.push(employeeData.fullName);
        }
      });
      setEmployeeList([currentUserFullName, ...employeeList]);
    } catch (error) {
      console.error("Error fetching employees with matching branches:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
    fetchEmployeesWithMatchingBranches(currentUserId);
    fetchAllocatedShifts();
  }, []);

  const fetchAllocatedShifts = () => {
    const shiftsRef = collection(db, 'shifts');
    onSnapshot(shiftsRef, (snapshot) => {
      const shifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScheduleList(shifts);

      const calendarEvents = shifts.map(shift => ({
        title: `${shift.name} - ${shift.location}`,
        start: new Date(shift.date),
        end: new Date(shift.date),
        allDay: true,
      }));
      setEvents(calendarEvents);
    });
  };

  const checkShiftConflict = async () => {
    const shiftsRef = collection(db, 'shifts');
    const conflictQuery = query(
      shiftsRef,
      where("date", "==", selectedDate),
      where("time", "==", shiftTime),
      where("location", "==", location)
    );
    const conflictSnapshot = await getDocs(conflictQuery);

    if (!conflictSnapshot.empty) {
      showNotification("A shift with this date, time, and location already exists.", 'error');
      return true;
    }
    return false;
  };

  const addOrUpdateShift = async () => {
    if (!selectedDate) return showNotification("Please select a date.", 'warning');
    if (!employeeName) return showNotification("Please select an employee.", 'warning');
    if (!location) return showNotification("Please select a location.", 'warning');

    if (await checkShiftConflict()) return;

    const newShift = {
      date: selectedDate,
      name: employeeName,
      time: shiftTime,
      location,
      timestamp: moment().format('MM-DD-YYYY HH:mm:ss'), // Add timestamp
    };

    try {
      if (isEditing && editShiftId) {
        const shiftRef = doc(db, 'shifts', editShiftId);
        await updateDoc(shiftRef, newShift);
        showNotification(`Shift updated for ${employeeName} on ${selectedDate}.`, 'success');
      } else {
        await addDoc(collection(db, 'shifts'), newShift);
        showNotification(`Shift added for ${employeeName} on ${selectedDate}.`, 'success');
      }

      setSelectedDate('');
      setEmployeeName('');
      setShiftTime('AM');
      setLocation('');
      setIsEditing(false);
      setEditShiftId(null);
    } catch (error) {
      console.error("Error adding/updating shift:", error);
      showNotification("Error adding or updating shift.", 'error');
    }
  };

  const editShift = (shift) => {
    setSelectedDate(shift.date);
    setEmployeeName(shift.name);
    setShiftTime(shift.time);
    setLocation(shift.location);
    setIsEditing(true);
    setEditShiftId(shift.id);
  };

  const deleteShift = async (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      try {
        const shiftRef = doc(db, 'shifts', shiftId);
        const shiftSnapshot = await getDoc(shiftRef);

        if (shiftSnapshot.exists()) {
          const shiftData = shiftSnapshot.data();
          const deletedShift = {
            ...shiftData,
            deletedAt: moment().format('YYYY-MM-DD HH:mm:ss'), // Add deletion timestamp
          };

          // You can log the deletedShift to a separate collection if needed.
          console.log('Deleted Shift:', deletedShift);

          await deleteDoc(shiftRef);
          showNotification(`Shift deleted for ${shiftData.name} on ${shiftData.date}.`, 'success');
        } else {
          showNotification("Shift not found. It may have already been deleted.", 'error');
        }
      } catch (error) {
        console.error("Error deleting shift:", error.message);
        showNotification("Error deleting shift. Please try again later.", 'error');
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="min-h-screen bg-white/70 backdrop-blur-lg p-8 w-full max-w-5xl mx-auto rounded-lg shadow-2xl">
        <h1 className="text-4xl font-extrabold text-black text-center mb-8"> Schedule</h1>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-black mb-4"> Event Calendar</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              views={['month', 'week', 'day']}
              className="bg-white border border-gray-300 rounded-lg text-gray-700"
               eventPropGetter={eventStyleGetter} // Apply the custom styling
            />
          </div>
        </div>

        {/* Calendar and Form for Adding Shifts */}
        <div className="container mx-auto px-6 py-8 space-y-6 bg-white rounded-lg shadow-lg mt-6">
          <div className="flex flex-col md:flex-row justify-center items-center mb-4">
            <label className="mr-3 text-gray-700 font-semibold text-sm md:text-base">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-yellow-500 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Display error if date is in the past */}
          {dateError && (
            <div className="text-red-600 text-sm font-medium mb-4">
              {dateError}
            </div>
          )}

          {/* Shift Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div>
              <label className="mb-2 block text-gray-700 font-semibold text-sm md:text-base">Employee Name:</label>
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border border-yellow-500 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Employee</option>
                {employeeList.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-gray-700 font-semibold text-sm md:text-base">Shift Time:</label>
              <select
                value={shiftTime}
                onChange={(e) => setShiftTime(e.target.value)}
                className="border border-yellow-500 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-gray-700 font-semibold text-sm md:text-base">Location:</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-yellow-500 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Location</option>
                {locationOptions.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={addOrUpdateShift}
                className={`${isEditing ? 'bg-blue-600' : 'bg-yellow-600'} text-white rounded-lg px-4 py-2 font-semibold hover:bg-opacity-80`}
              >
                {isEditing ? 'Update Shift' : 'Add Shift'}
              </button>
            </div>
          </div>
        </div>

        {notification.message && (
          <div className={`p-4 mb-4 text-white rounded-lg ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {notification.message}
          </div>
        )}

        {/* Allocated Shifts List */}
        <div className="container mx-auto px-6 py-8 bg-white rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Allocated Shifts List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-yellow-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Employee</th>
                  <th className="px-4 py-2 text-left font-semibold">Shift</th>
                  <th className="px-4 py-2 text-left font-semibold">Location</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList.map((shift) => (
                  <tr key={shift.id} className="hover:bg-yellow-100">
                    <td className="border px-4 py-2 text-gray-700">{shift.date}</td>
                    <td className="border px-4 py-2 text-gray-700">{shift.name}</td>
                    <td className="border px-4 py-2 text-gray-700">{shift.time}</td>
                    <td className="border px-4 py-2 text-gray-700">{shift.location}</td>
                    <td className="border px-4 py-2 text-gray-700 flex space-x-2">
                      <button
                        onClick={() => editShift(shift)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteShift(shift.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPSchedule;

