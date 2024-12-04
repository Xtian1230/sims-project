// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../../Firebase/firebaseConfig.js'; // Ensure correct path to your Firebase config file
import { Link } from 'react-router-dom';

export default function RecentOrders() {
    const [shiftSchedules, setShiftSchedules] = useState([]);

    // Get today's date in "YYYY-MM-DD" format
    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const fetchTodayShifts = () => {
        try {
            // Access the 'shifts' collection in Firestore
            const shiftsRef = collection(db, 'shifts');

            // Listen to real-time updates in the 'shifts' collection
            onSnapshot(shiftsRef, (snapshot) => {
                // Filter for shifts that match today's date
                const todaysShifts = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(shift => shift.date === todayDate);

                setShiftSchedules(todaysShifts);
            });
        } catch (error) {
            console.error('Error fetching shifts: ', error);
        }
    };

    useEffect(() => {
        fetchTodayShifts();
    }, []);

    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Employee Schedule for Today</strong>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr className="bg-yellow-300">
                            <th className="px-4 py-2">Employee Name</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftSchedules.length > 0 ? (
                            shiftSchedules.map((shift) => (
                                <tr key={shift.id} className="hover:bg-yellow-100 transition-colors">
                                    <td className="px-4 py-2">
                                        <Link to={`/employee/${shift.id}`} className="text-blue-500 hover:underline">
                                            {shift.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">{shift.time}</td>
                                    <td className="px-4 py-2">{shift.date}</td>
                                    <td className="px-4 py-2">{shift.location}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                    No shifts scheduled for today.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

