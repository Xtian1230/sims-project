// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import BgImage from '../../assets/BgImage.jpg'
import { db } from '../../Firebase/firebaseConfig'
import { onSnapshot, collection, query, where, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const SPNotification = () => {
    const [notifications, setNotifications] = useState([])
    const [userName, setUserName] = useState(null)
    const [visibleNotifications, setVisibleNotifications] = useState(5)

    useEffect(() => {
        // Get the logged-in user's uid from Firebase Authentication
        const auth = getAuth()
        const user = auth.currentUser

        if (user) {
            const userUid = user.uid

            // Query the employees collection to get the user's full name based on uid
            const getUserData = async () => {
                try {
                    const employeesRef = collection(db, 'employees')
                    const employeeQuery = query(employeesRef, where('uid', '==', userUid))
                    const querySnapshot = await getDocs(employeeQuery)

                    if (!querySnapshot.empty) {
                        const employeeData = querySnapshot.docs[0].data()
                        setUserName(employeeData.fullName) // Set the user's full name
                    } else {
                        console.error('No employee found for the current user.')
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.message)
                }
            }

            getUserData()
        } else {
            console.error('No user is logged in.')
        }
    }, [])

    useEffect(() => {
        if (!userName) return // Wait for userName to be set

        // Query to get shifts only for the logged-in user by name
        const shiftsRef = collection(db, 'shifts')
        const userShiftsQuery = query(shiftsRef, where('name', '==', userName))

        const unsubscribe = onSnapshot(userShiftsQuery, (snapshot) => {
            setNotifications((prevNotifications) => {
                const newNotifications = []

                snapshot.docChanges().forEach((change) => {
                    const shiftData = change.doc.data()
                    const action = change.type // "added", "modified", "removed"

                    // Validate shiftData fields
                    if (!shiftData?.date || !shiftData?.time || !shiftData?.location || !shiftData?.name) {
                        console.warn('Incomplete shift data', shiftData)
                        return
                    }

                    let message
                    if (action === 'added') {
                        message = `New shift added for ${shiftData.name} on ${shiftData.date} (${shiftData.time}) at ${shiftData.location}.`
                    } else if (action === 'modified') {
                        message = `Shift updated for ${shiftData.name} on ${shiftData.date} (${shiftData.time}) at ${shiftData.location}.`
                    } else if (action === 'removed') {
                        message = `Shift for ${shiftData.name} on ${shiftData.date} was deleted.`
                    }

                    if (message) {
                        // Add only if the message does not already exist
                        if (
                            !prevNotifications.some((notif) => notif.id === change.doc.id && notif.message === message)
                        ) {
                            newNotifications.push({
                                id: change.doc.id,
                                message,
                                timestamp: shiftData.timestamp || new Date().toISOString()
                            })
                        }
                    }
                })

                return [...prevNotifications, ...newNotifications]
            })
        })

        // Cleanup the listener
        return () => unsubscribe()
    }, [userName])

    const deleteNotification = (notifId) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notifId))
    }

    const showMoreNotifications = () => {
        setVisibleNotifications((prev) => prev + 5)
    }

    const showLessNotifications = () => {
        setVisibleNotifications(5)
    }

    return (
        <div
            className="min-h-screen flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${BgImage})` }}
        >
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg w-full max-w-3xl p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center text-yellow-600">Your Notifications</h1>

                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center">No new notifications</p>
                ) : (
                    <div className="space-y-4">
                        {[...notifications]
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp, latest first
                            .slice(0, visibleNotifications)
                            .map((notif) => (
                                <div
                                    key={notif.id}
                                    className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-start"
                                >
                                    <div>
                                        <p className="text-gray-700">{notif.message}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(notif.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        className="ml-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
                <div className="flex justify-between items-center space-x-4">
                    {notifications.length > visibleNotifications && (
                        <button
                            className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-bold hover:bg-yellow-700 transition duration-200"
                            onClick={showMoreNotifications}
                        >
                            Show More
                        </button>
                    )}
                    {visibleNotifications > 5 && (
                        <button
                            className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700 transition duration-200"
                            onClick={showLessNotifications}
                        >
                            Show Less
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SPNotification
