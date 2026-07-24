import React, { useState } from "react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useSelector } from "react-redux";

const AdminDefaultLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { isAdminLoggedIn } = useSelector((state) => state.authentication);

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden text-gray-500">
        {/* Desktop Sidebar */}
        <div
          className={`hidden lg:block bg-[#262D34] transition-all duration-300 ${
            collapsed ? "w-20" : "w-[280px]"
          }`}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#262D34] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            collapsed={false}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#5d7186bf]/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Side */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto bg-[#f9f7f7]">
            <div className="w-full p-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDefaultLayout;
