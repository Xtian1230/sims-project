// eslint-disable-next-line no-unused-vars
import React from 'react';
import BgImage from '../../assets/BgImage.jpg';

const Notification = () => {
    const notifications = [
        { id: 1, title: "Update on Inventory", message: "New stock has arrived. Please check the Inventory page for details.", time: "2 hours ago" },
        { id: 2, title: "Meeting Reminder", message: "Scheduled meeting tomorrow at 10:00 AM. Please prepare the sales report.", time: "1 day ago" },
        { id: 3, title: "System Maintenance", message: "System will undergo maintenance on Friday from 1:00 AM to 4:00 AM.", time: "3 days ago" },
    ];

    return (
        <div style={{
            backgroundImage: `url(${BgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
        }}>
            <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-3xl p-8 space-y-8">
                <h1 className="text-3xl font-bold text-center text-yellow-600">Notifications</h1>

                <div className="space-y-4">
                    {notifications.map(notification => (
                        <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md border border-yellow-500">
                            <h2 className="text-xl font-semibold text-yellow-600">{notification.title}</h2>
                            <p className="text-gray-700 mt-2">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                        </div>
                    ))}
                </div>

                <button
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg font-bold hover:bg-yellow-700 transition duration-200"
                    onClick={() => alert('No new notifications')}
                >
                    Mark All as Read
                </button>
            </div>
        </div>
    );
};

export default Notification;
