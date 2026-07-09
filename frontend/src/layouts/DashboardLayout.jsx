import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">

      <Sidebar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default DashboardLayout;