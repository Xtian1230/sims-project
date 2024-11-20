// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/SPSidebar';
import Header from '../shared/SPHeader';

const SPLayout = () => {
  // Manage the sidebar's visibility state
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      <Sidebar isOpen={isSidebarOpen} />
      <div className='flex-1 flex flex-col'>
        <Header toggleSidebar={toggleSidebar} />
        <div className='flex-1 overflow-y-auto p-4'>{<Outlet />}</div>
      </div>
    </div>
  );
};

export default SPLayout;
