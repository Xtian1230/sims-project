// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import BgImage from '../../assets/BgImage.jpg';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Basic styles for react-big-calendar
import { db } from '../../Firebase/firebaseConfig.js';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

// Initialize localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const ESchedule = () => {
  const [scheduleList, setScheduleList] = useState([]);
  const [setEmployeeList] = useState([]);
  const [setLocationOptions] = useState([]);
  const [events, setEvents] = useState([]);
  // Fetch employees with matching branches
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

  // Fetch and set events in calendar format
  const fetchAllocatedShifts = () => {
    const shiftsRef = collection(db, 'shifts');
    onSnapshot(shiftsRef, (snapshot) => {
      const shifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScheduleList(shifts);

      // Map shifts to calendar event format
      const calendarEvents = shifts.map(shift => ({
        title: `${shift.name} - ${shift.location}`,
        start: new Date(shift.date), // Ensure date is in Date format
        end: new Date(shift.date), // Customize if shifts have end times
        allDay: true,
        
      }));
      setEvents(calendarEvents);
    });
  };
  
  useEffect(() => {
    const auth = getAuth();
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
    fetchEmployeesWithMatchingBranches(currentUserId);
    fetchAllocatedShifts();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="min-h-screen bg-white/70 backdrop-blur-lg p-8 w-full max-w-5xl mx-auto rounded-lg shadow-2xl">
        <h1 className="text-3xl font-extrabold text-black text-center mb-8">Service Crew Schedule</h1>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-black mb-4">Event Calendar</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              views={['month', 'week', 'day']}
              className="bg-white border border-gray-300 rounded-lg text-gray-700"
            />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-black mb-4">Upcoming Shifts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-yellow-200">
                  <th className="px-6 py-3 border-b-2 border-yellow-500 text-left text-yellow-700 font-semibold">Date</th>
                  <th className="px-6 py-3 border-b-2 border-yellow-500 text-left text-yellow-700 font-semibold">Employee Name</th>
                  <th className="px-6 py-3 border-b-2 border-yellow-500 text-left text-yellow-700 font-semibold">Shift Time</th>
                  <th className="px-6 py-3 border-b-2 border-yellow-500 text-left text-yellow-700 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList.length > 0 ? (
                  scheduleList.map((shift) => (
                    <tr key={shift.id} className="hover:bg-yellow-100 transition-colors">
                      <td className="px-6 py-4 border-b border-yellow-300 text-gray-700">{shift.date}</td>
                      <td className="px-6 py-4 border-b border-yellow-300 text-gray-700">{shift.name}</td>
                      <td className="px-6 py-4 border-b border-yellow-300 text-gray-700">{shift.time}</td>
                      <td className="px-6 py-4 border-b border-yellow-300 text-gray-700">{shift.location}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 border-b border-yellow-300 text-center text-gray-500">
                      No shifts scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESchedule;
