// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import Header from '../shared/Header';

import BgImage from '../../assets/BgImage.jpg'

const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Layout = () => {
  // Manage the sidebar's visibility state
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div style={BgStyle} className=' overflow-hidden'>
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-x-hidden'>
      <Sidebar isOpen={isSidebarOpen} />
      <div className='flex-1 flex flex-col'>
        <Header toggleSidebar={toggleSidebar} />
        <div className='flex-1 overflow-y-auto p-4'>{<Outlet />}</div>
      </div>
    </div>
    </div>
  );
};

export default Layout;
