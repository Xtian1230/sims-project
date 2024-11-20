// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../Firebase/firebaseConfig.js'; // Ensure correct path to your Firebase config file
import { Link } from 'react-router-dom';

export default function RecentOrders() {
    const [shiftSchedules, setShiftSchedules] = useState([]);

    // Get today's date in "YYYY-MM-DD" format
    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const fetchTodayShifts = async () => {
        try {
            // Access the 'shift' collection in Firestore
            const shiftsRef = collection(db, 'shift');
            const snapshot = await getDocs(shiftsRef);

            // Filter for shifts that match today's date
            const todaysShifts = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(shift => shift.date === todayDate);

            setShiftSchedules(todaysShifts);
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
                        <tr className=' bg-yellow-300'>
                            <th>ID</th>
                            <th>Employee Name</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftSchedules.map((shift) => (
                            <tr key={shift.id}>
                                <td>
                                    <Link to={`/shift/${shift.id}`}>#{shift.id}</Link>
                                </td>
                                <td>
                                    <Link to={`/employee/${shift.id}`}>{shift.name}</Link>
                                </td>
                                <td>{shift.time}</td>
                                <td>{shift.date}</td>
                                <td>{shift.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
