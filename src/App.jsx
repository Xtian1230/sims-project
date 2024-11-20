// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Login from "./components/login/Login";
import ForgotPass from "./components/login/ForgotPass";
import Dashboard from "./components/Admin/Dashboard";
import Products from "./components/Admin/Products";
import Inventory from "./components/Admin/Inventory";
import Reports from "./components/Admin/Reports";
import DailyReport from "./components/Admin/DailyWeeklyReport/DailyReport";
import WeeklyReport from "./components/Admin/DailyWeeklyReport/WeeklyReport";
import Employees from "./components/Admin/Employees";
import Profile from "./components/Admin/Profile";
import Notification from "./components/Admin/Notification";

import SPLayout from "./components/shared/SPLayout";
import SPDashboard from "./components/Supervisor/SPDashboard";
import SPSalesReport from "./components/Supervisor/SPSalesReport";
import SPInventory from "./components/Supervisor/SPInvetory";
import SPEmployee from "./components/Supervisor/SPEmployee";
import SPSchedule from "./components/Supervisor/SPSchedule";
import SPProfile from "./components/Supervisor/SPProfile";
import SPNotification from "./components/Supervisor/SPNotification";

import ELayout from "./components/shared/ELayout";
import EDashboard from "./components/ServiceCrew/EDashboard";
import EInventory from "./components/ServiceCrew/EInventory";
import ESalesReport from "./components/ServiceCrew/ESalesReport";
import ESchedule from "./components/ServiceCrew/ESchedule";
import EProfile from "./components/ServiceCrew/EProfile";
import ENotification from "./components/ServiceCrew/ENotification";

function App() {
  const isAuthenticated = false; // Replace with actual authentication check logic

  return (
    <Router>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/daily/:location" element={<DailyReport />} />
            <Route path="reports/weekly/:location" element={<WeeklyReport />} />
            <Route path="employees" element={<Employees />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notification" element={<Notification />} />
          </Route>

          <Route path="/spdashboard" element={<SPLayout />}>
            <Route index element={<SPDashboard />} />
            <Route path="spinventory" element={<SPInventory />} />
            <Route path="spsalesreport" element={<SPSalesReport />} />
            <Route path="spemployee" element={<SPEmployee />} />
            <Route path="spschedule" element={<SPSchedule />} />
            <Route path="spprofile" element={<SPProfile />} />
            <Route path="spnotification" element={<SPNotification />} />
          </Route>

          <Route path="/edashboard" element={<ELayout />}>
            <Route index element={<EDashboard />} />
            <Route path="einventory" element={<EInventory />} />
            <Route path="esalesreport" element={<ESalesReport />} />
            <Route path="eschedule" element={<ESchedule />} />
            <Route path="eprofile" element={<EProfile />} />
            <Route path="enotification" element={<ENotification />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

