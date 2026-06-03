import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUsers,
  FiUserCheck,
  FiShoppingCart,
  FiPackage,
  FiTag,
  FiPercent,
  FiTruck,
  FiGift,
  FiShield,
  FiCreditCard,
  FiRepeat,
  FiFileText,
} from "react-icons/fi";

import {
  TbDashboardFilled,
  TbSettingsFilled,
  TbCategory,
} from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import { IoChevronDownSharp } from "react-icons/io5";
import {
  setActiveAccountCenterTab,
  setActiveSubTab,
} from "../../features/slices/references";

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeTab, activeSub } = useSelector((state) => state.references);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { adminData } = useSelector((state) => state.authentication);
  const handleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleNavigate = (
    url,
    label,
    parentLabel = null,
    subLabel = null,
    state = null,
  ) => {
    dispatch(setActiveAccountCenterTab(parentLabel || label));
    dispatch(setActiveSubTab(subLabel));

    navigate(url, state ? { state } : undefined);
    if (closeSidebar) closeSidebar();
  };


  const menuItems =
  [
    {
      label: "Dashboard",
      icon: TbDashboardFilled,
      url: "/admin",
    },
        {
      label: "Role & Permissions",
      icon: FiShield,
      children: [
        { name: "All Roles", url: "/admin/role" },
        {
          name: "Add Role",
          url: "/admin/role",
          state: { openModal: true },
        },
         { name: "All Permissions", url: "/admin/permission" },
      ],
    },
        {
      label: "Manage Admin Users",
      icon: FiUserCheck,
      children: [
        { name: "All Users", url: "/admin/user" },
        {
          name: "Add User",
          url: "/admin/user",
          state: { openModal: true },
        },
      ],
    },
        {
      label: "Manage Agents",
      icon: FiUserCheck,
      children: [
        { name: "All Agents", url: "/admin/agent" },
        {
          name: "Add Agent",
          url: "/admin/agent",
          state: { openModal: true },
        },
      ],
    },
        {
      label: "Bank Management",
      icon: FiUserCheck,
      children: [
        { name: "All Banks", url: "/admin/bank" },
        {
          name: "Add Bank",
          url: "/admin/bank",
          state: { openModal: true },
        },
      ],
    },

    {
      label: "Maintenance",
      icon: FiFileText,
      children: [
        { name: "Maintenance Mode", url: "/admin/maintenance/mode" },
        { name: "Maintenance Contact", url: "/admin/maintenance/contact" },
      ],
    },
    {
      label: "Settings",
      icon: TbSettingsFilled,
      children: [
        { name: "Site Settings", url: "/admin/settings/site-settings" },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-gray-400 shadow-xl">
      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin  scrollbar-thumb-gray-700">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
           <div className="flex items-center justify-center">
  <img
    src="/logo.png"
    alt="PMS Logo"
    className="h-14 rounded-xl w-auto object-contain"
  />
</div>
          </Link>
        </div>

        {/* Main Menu */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            const hasChildren = !!item.children;
            const isActiveParent = activeTab === item.label;

            return (
              <li key={item.label}>
                {/* Main Item */}
                <div
                  onClick={() =>
                    hasChildren
                      ? handleDropdown(item.label)
                      : handleNavigate(item.url, item.label)
                  }
                  className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-all ${
                    isActiveParent
                      ? "bg-gradient-to-r from-[#EF4444] to-[#89101C] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#89101C]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 flex justify-center mt-[2px]">
                      <ItemIcon
                        className={
                          isActiveParent
                            ? "text-white text-lg"
                            : "text-gray-400 text-lg"
                        }
                      />
                    </span>

                    <span className="font-medium leading-tight whitespace-normal">
                      {item.label}
                    </span>
                  </div>

                  {hasChildren && (
                    <IoChevronDownSharp
                      className={`text-sm transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Dropdown */}
                {hasChildren && (
                  <ul
                    className={`ml-10 mt-2 space-y-1  overflow-hidden transition-all duration-300 ${
                      openDropdown === item.label
                        ? "max-h-64 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((sub, i) => {
                      const isSubActive = activeSub === sub.name;
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            handleNavigate(
                              sub.url,
                              item.label,
                              item.label,
                              sub.name,
                              sub.state, // 👈 pass state
                            )
                          }
                          className={`cursor-pointer text-sm py-1 pl-2 border-l-2 transition-all ${
                            isSubActive
                              ? "text-white border-blue-500 font-semibold"
                              : "text-gray-400 border-transparent hover:text-white hover:border-blue-400"
                          }`}
                        >
                          {sub.name}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
