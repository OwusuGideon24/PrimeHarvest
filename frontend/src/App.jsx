import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Referrals from "./pages/Referrals";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminTransactions from "./pages/AdminTransactions";
import AdminSettings from "./pages/AdminSettings";
import AdminPlans from "./pages/AdminPlans";
import AdminDeposits from "./pages/AdminDeposits";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navigate
              to="/admin/dashboard"
              replace
            />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/withdrawals"
        element={
          <AdminRoute>
            <AdminWithdrawals />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <AdminRoute>
            <AdminUserDetails />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/deposits"
        element={
          <AdminRoute>
            <AdminDeposits />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/plans"
        element={
          <AdminRoute>
            <AdminPlans />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />

      {/* Protected user routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/wallet"
          element={<Wallet />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/referrals"
          element={<Referrals />}
        />

        <Route
          path="/deposit"
          element={<Deposit />}
        />

        <Route
          path="/withdraw"
          element={<Withdraw />}
        />
      </Route>

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;