//SPHeader.jsx
// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig.js';
import { getAuth } from 'firebase/auth';

export default function SPHeader() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Get the logged-in user's uid from Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userUid = user.uid;

      // Query the employees collection to get the user's full name based on uid
      const getUserData = async () => {
        const employeesRef = collection(db, 'employees');
        const employeeQuery = query(employeesRef, where('uid', '==', userUid));
        const querySnapshot = await getDocs(employeeQuery);

        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          setUserName(employeeData.fullName); // Set the user's full name
        }
      };

      getUserData();
    }
  }, []);

  useEffect(() => {
    if (!userName) return; // Wait for userName to be set

    // Query to get shifts only for the logged-in user by name
    const shiftsRef = collection(db, 'shifts');
    const userShiftsQuery = query(shiftsRef, where('name', '==', userName));

    const unsubscribe = onSnapshot(userShiftsQuery, (snapshot) => {
      const newNotifications = [];

      snapshot.docChanges().forEach((change) => {
        const shiftData = change.doc.data();
        const action = change.type; // "added", "modified", "removed"
        let message;

        if (action === 'added') {
          message = `New shift added for ${shiftData.name} on ${shiftData.date} (${shiftData.time}) at ${shiftData.location}.`;
        } else if (action === 'modified') {
          message = `Shift updated for ${shiftData.name} on ${shiftData.date} (${shiftData.time}) at ${shiftData.location}.`;
        } else if (action === 'removed') {
          message = `Shift for ${shiftData.name} on ${shiftData.date} was deleted.`;
        }

        if (message) {
          newNotifications.push({
            id: change.doc.id,
            message,
            timestamp: new Date().toISOString(),
          });
        }
      });

      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, [userName]);

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
      <div className="flex font-semibold text-gray-700">
        <span className="text-white text-2xl">
          <span className="text-red-500">A</span>
          <span className="text-green-500">n</span>
          <span className="text-red-800">g</span>
          <span className="text-blue-500">e</span>
          <span className="text-orange-500">l</span>
          <span className="text-purple-500">&apos;s</span>
          <span className="text-red-500"> Burger</span>
        </span>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className={classNames(
                  open && 'bg-gray-100',
                  'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                )}
              >
                <HiOutlineBell fontSize={24} />
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    {notifications.length}
                  </span>
                )}
              </PopoverButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">Notifications</strong>
                    <div className="mt-2 py-1 text-sm max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500">No new notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="mb-2">
                            <p className="text-gray-700">{notif.message}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(notif.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                      <div className="mt-2 flex justify-between">
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Mark All as Read
                          </button>
                        )}
                        <button
                          onClick={() => navigate('spnotification')}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Show More
                        </button>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative">
          <div>
            <MenuButton className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className="sr-only">Open user menu</span>
              <div
                className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: 'url("/src/assets/profile.png")' }}
              >
                <span className="sr-only">Marc Backes</span>
              </div>
            </MenuButton>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate('spprofile')}
                    className={classNames(
                      active && 'bg-gray-100',
                      'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    Your Profile
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate('sphistory')}
                    className={classNames(
                      active && 'bg-gray-100',
                      'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    History
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate('/login')}
                    className={classNames(
                      active && 'bg-gray-100',
                      'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    Sign out
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

// PropTypes validation
SPHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired, // Validate that toggleSidebar is a required function
};
