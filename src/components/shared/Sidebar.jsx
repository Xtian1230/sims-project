// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../lib/consts/Navigation';
import { HiOutlineLogout, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

const SidebarContext = createContext();

const linkClasses = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

const Sidebar = ({ isOpen }) => {
    const [expanded, setExpanded] = useState(isOpen);

    return (
        <SidebarContext.Provider value={{ expanded }}>
            <div className={classNames('bg-neutral-900 p-3 flex flex-col text-white transition-all', {
                'w-60': expanded,
                'w-20': !expanded,
            })}>
                {/* Logo and Toggle Button */}
                <div className='flex items-center justify-between px-1 py-3'>
                    <div className='flex items-center gap-2'>
                        <img src="/src/assets/burger(1).png" rel="Icon" className="h-6 w-6" />
                        {expanded && (
                            <span className='text-yellow-400 text-xl'>Area Manager</span>
                        )}
                        {expanded && <span className='text-red-500 text-lg'></span>}
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className="text-white py-0">
                        {expanded ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className='py-8 flex flex-1 flex-col gap-0.5'>
                    {DASHBOARD_SIDEBAR_LINKS.map((item) => (
                        <SidebarLink key={item.key} item={item} />
                    ))}
                </div>

                {/* Bottom Links and Logout */}
                <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
                    {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                        <SidebarLink key={item.key} item={item} />
                    ))}
                    <Link to="/login" className={classNames('text-red-500', linkClasses)}>
                        <span className='text-xl'>
                            <HiOutlineLogout />
                        </span>
                        {expanded && "Logout"}
                    </Link>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};

function SidebarLink({ item }) {
    const { pathname } = useLocation();
    const { expanded } = useContext(SidebarContext);

    return (
        <Link
            to={item.path}
            className={classNames(
                pathname === item.path ? 'text-yellow-300' : 'text-neutral-400',
                linkClasses
            )}
        >
            <span className='text-xl'>{item.icon}</span>
            {expanded && item.label}
        </Link>
    );
}

SidebarLink.propTypes = {
    item: PropTypes.shape({
        path: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
};

// PropTypes validation for Sidebar component
Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Validate that isOpen is a required boolean
};

export default Sidebar;
