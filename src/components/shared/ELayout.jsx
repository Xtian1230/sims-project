// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ESidebar from '../shared/ESidebar';
import EHeader from '../shared/EHedear';

const ELayout = () => {
  // Manage the sidebar's visibility state
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      <ESidebar isOpen={isSidebarOpen} />
      <div className='flex-1 flex flex-col'>
        <EHeader toggleSidebar={toggleSidebar} />
        <div className='flex-1 overflow-y-auto p-4'>{<Outlet />}</div>
      </div>
    </div>
  );
};

export default ELayout;
