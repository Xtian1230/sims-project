// Dashboard.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import DashboardStatsGrid from '../AdminDashboard/DasboardStatsGrid';
import TransactionChart from '../AdminDashboard/TransactionChart';
import PopularProducts from '../AdminDashboard/PopularProduct';
import RecentOrders from '../AdminDashboard/EmployeeDailySched';
import BgImage from '../../assets/BgImage.jpg';

const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

export default function Dashboard() {
  return (
    <div style={BgStyle} className="overflow-hidden min-h-screen">
      <div className="min-h-screen bg-white/50 backdrop-blur-3xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-6 overflow-x-hidden">
          {/* Dashboard Stats */}
          <DashboardStatsGrid />

          {/* Charts Section */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <TransactionChart className="flex-1 min-h-[300px]" />
          </div>

          {/* Orders and Popular Products Section */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <RecentOrders className="flex-1 min-h-[300px]" />
            <PopularProducts className="flex-1 min-h-[300px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
