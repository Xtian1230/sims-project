// NotificationContext.js
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const markAsRead = (notificationId) => {
        setNotifications(notifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
        ));
    };

    // Add a function to mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Define PropTypes for children
NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

