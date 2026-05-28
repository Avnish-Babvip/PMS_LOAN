import React, { useState } from "react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const AdminDefaultLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  return (
    <ErrorBoundary>
      {/* PAGE WRAPPER – blocks horizontal scroll */}
      <div className="flex w-full overflow-x-hidden h-screen text-white">
        {/* DESKTOP SIDEBAR – fixed on left */}
        <div className="hidden lg:block w-[280px] bg-[#262D34] flex-shrink-0">
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#262D34] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
          }`}
        >
          <Sidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[#5d7186bf]/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* RIGHT SIDE (header + outlet) */}
        <div className="flex-1 flex flex-col  min-w-0">
          <Header setSidebarOpen={setSidebarOpen} />

          {/* OUTLET AREA – only this scrolls horizontally */}
          <main className="flex-1 -mt-px bg-[#f9f7f7] overflow-y-auto">
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
