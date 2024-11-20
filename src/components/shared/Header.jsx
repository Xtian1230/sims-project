// eslint-disable-next-line no-unused-vars
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

export default function Header() {
    const navigate = useNavigate();

    return (
        <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
            {/* Toggle button for the sidebar */}
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
                                        <div className="mt-2 py-1 text-sm">This is the notification panel.</div>
                                        {/* Show More button */}
                                        <button
                                            onClick={() => navigate('notification')}
                                            className="mt-2 text-blue-600 hover:underline text-sm"
                                        >
                                            Show More
                                        </button>
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
                                        onClick={() => navigate('profile')}
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
Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired, // Validate that toggleSidebar is a required function
};
