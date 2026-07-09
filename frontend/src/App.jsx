import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Referrals from "./pages/Referrals";
import Deposit from "./pages/Deposit";  

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminTransactions from "./pages/AdminTransactions";
import AdminSettings from "./pages/AdminSettings";
import AdminPlans from "./pages/AdminPlans";
import AdminDeposits from "./pages/AdminDeposits";
import Withdraw from "./pages/Withdraw";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/deposits" element={<AdminDeposits />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route
  path="/admin/settings"
  element={<AdminSettings />}
/>
      <Route
  path="/admin/transactions"
  element={<AdminTransactions />}
/>
      <Route
  path="/admin/plans"
  element={<AdminPlans />}
/>
      <Route
  path="/admin/users/:id"
  element={<AdminUserDetails />}
/>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/deposit" element={<Deposit />} />
      </Route>

    </Routes>
  );
}

export default App;