import React, { useState, useEffect } from 'react'
import BgImage from '../../assets/BgImage.jpg'
import { db } from '../../Firebase/firebaseConfig.js'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { Textarea } from '@material-tailwind/react'
import PropTypes from 'prop-types' // Import PropTypes

const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [selectedSupervisor, setSelectedSupervisor] = useState('') // Move state up to parent
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationsCollection = collection(db, 'notifications')
                const notificationsSnapshot = await getDocs(notificationsCollection)

                const notificationsList = notificationsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    Title: doc.data().Title || 'Untitled',
                    Description: doc.data().Description || 'No description available',
                    Time: doc.data().Time || 'No timestamp available'
                }))

                setNotifications(notificationsList)
            } catch (err) {
                console.error('Error fetching notifications: ', err)
                setError('Failed to fetch notifications. Please try again later.')
            }
        }

        fetchNotifications()
    }, [])

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification)
    }

    const closeModal = () => {
        setSelectedNotification(null)
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-center p-6"
            style={{ backgroundImage: `url(${BgImage})` }}
        >
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl space-y-8">
                <h1 className="text-3xl font-bold text-center text-yellow-600">Notifications</h1>

                {error && <p className="text-red-500">{error}</p>}

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <p>No notifications available</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-white p-4 rounded-lg shadow-md border border-yellow-500 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <h2 className="text-xl font-semibold text-yellow-600">{notification.Title}</h2>
                                <p className="text-gray-700 mt-2">{notification.Description}</p>
                                <p className="text-sm text-gray-500 mt-2">{notification.Time}</p>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg font-bold hover:bg-yellow-700 transition duration-200"
                    onClick={() => alert('No new notifications')}
                >
                    Mark All as Read
                </button>
            </div>

            {selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                        <h2 className="text-2xl font-semibold text-yellow-600">Edit Notification</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="editTitle" className="block text-sl font-bold text-gray-700">
                                    Title
                                </label>
                                <input
                                    id="editTitle"
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                    value={selectedNotification.Title}
                                    onChange={(e) =>
                                        setSelectedNotification({ ...selectedNotification, Title: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label htmlFor="editMessage" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <Textarea
                                    id="editMessage"
                                    rows={4}
                                    className="flex w-96 flex-col gap-6 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm hover:shadow-lg transition-shadow duration-200"
                                    placeholder="Add Remarks"
                                    value={selectedNotification.Description}
                                    onChange={(e) =>
                                        setSelectedNotification({
                                            ...selectedNotification,
                                            Description: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <p className="text-sm text-gray-500">{selectedNotification.Time}</p>
                        </div>

                        {/* Pass selectedSupervisor and setSelectedSupervisor to EmployeeDropdown */}
                        <EmployeeDropdown
                            selectedSupervisor={selectedSupervisor}
                            setSelectedSupervisor={setSelectedSupervisor}
                        />

                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-bold hover:bg-gray-400 transition duration-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-yellow-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-yellow-700 transition duration-200"
                                onClick={async () => {
                                    try {
                                        const notificationDoc = doc(db, 'notifications', selectedNotification.id)
                                        const rawTimestamp = new Date().toISOString()
                                        const formattedTimestamp = rawTimestamp.replace('T', ' ').split('.')[0]
                                        await updateDoc(notificationDoc, {
                                            Title: selectedNotification.Title,
                                            Description: selectedNotification.Description,
                                            Supervisor: selectedSupervisor,
                                            Time: formattedTimestamp
                                        })

                                        alert('Notification updated successfully:', selectedNotification)
                                        closeModal()
                                    } catch (error) {
                                        console.error('Error updating notification:', error)
                                    }
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const EmployeeDropdown = ({ selectedSupervisor, setSelectedSupervisor }) => {
    const [supervisors, setSupervisors] = useState([])

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const employeeCollection = collection(db, 'employees')
                const employeeSnapshot = await getDocs(employeeCollection)

                const supervisorList = employeeSnapshot.docs
                    .filter((doc) => doc.data().role === 'Supervisor')
                    .map((doc) => ({
                        id: doc.id,
                        fullName: doc.data().fullName
                    }))

                setSupervisors(supervisorList)
            } catch (err) {
                console.error('Error fetching supervisors: ', err)
            }
        }

        fetchSupervisors()
    }, [])

    return (
        <div className="w-full max-w-sm mx-auto">
            <select
                id="supervisorDropdown"
                className="mt-8 text-black border-2 border-transparent hover:border-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center w-full shadow-md hover:shadow-lg transition-shadow duration-200"
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)} // Update selectedSupervisor
            >
                <option value="" disabled>
                    Select a supervisor
                </option>
                {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.fullName}>
                        {supervisor.fullName}
                    </option>
                ))}
            </select>
        </div>
    )
}

// Add PropTypes validation
EmployeeDropdown.propTypes = {
    selectedSupervisor: PropTypes.string.isRequired,
    setSelectedSupervisor: PropTypes.func.isRequired
}

export default Notification
;('This item is currently  @ quantity, do you wish to replenish this @item name ')
