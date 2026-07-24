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
  FiBriefcase,
  FiFolder,
} from "react-icons/fi";

import {
  TbDashboardFilled,
  TbSettingsFilled,
  TbCategory,
} from "react-icons/tb";

import { FaUniversity } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import { IoChevronDownSharp } from "react-icons/io5";
import {
  setActiveAccountCenterTab,
  setActiveSubTab,
} from "../../features/slices/references";

import { FiMenu } from "react-icons/fi";

const Sidebar = ({ collapsed, setCollapsed, closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTab, activeSub } = useSelector((state) => state.references);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { adminData } = useSelector((state) => state.authentication);
  const handleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const { permissions } = useSelector(
    (state) => state.authentication.adminData.admin,
  );

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

  const menuItems = [
    {
      label: "Dashboard",
      icon: TbDashboardFilled,
      url: "/admin",
      permission: "view dashboard",
    },
    {
      label: "Role & Permissions",
      icon: FiShield,
      permission: "view roles",
      children: [
        {
          name: "All Roles",
          url: "/admin/role",
          permission: "view roles",
        },
        {
          name: "Add Role",
          url: "/admin/role",
          state: { openModal: true },
          permission: "create roles",
        },
        {
          name: "All Permissions",
          url: "/admin/permission",
          permission: "view permissions",
        },
      ],
    },
    {
      label: "Manage Admin Users",
      icon: FiUsers,
      permission: "manage admins",
      children: [
        {
          name: "All Users",
          url: "/admin/user",
          permission: "manage admins",
        },
        {
          name: "Add User",
          url: "/admin/user",
          state: { openModal: true },
          permission: "manage admins",
        },
      ],
    },
    {
      label: "Manage Agents",
      icon: FiUserCheck,
      permission: "view agents",
      children: [
        {
          name: "All Agents",
          url: "/admin/agent",
          permission: "view agents",
        },
        {
          name: "Add Agent",
          url: "/admin/agent",
          state: { openModal: true },
          permission: "create agents",
        },
      ],
    },
    {
      label: "Bank Management",
      icon: FaUniversity,
      permission: "view banks",
      children: [
        {
          name: "All Banks",
          url: "/admin/bank",
          permission: "view banks",
        },
        {
          name: "Add Bank",
          url: "/admin/bank",
          state: { openModal: true },
          permission: "create banks",
        },
      ],
    },
    {
      label: "Case Management",
      icon: FiBriefcase,
      permission: "view cases",
      children: [
        {
          name: "All Cases",
          url: "/admin/case",
          permission: "view cases",
        },
        {
          name: "Add Case",
          url: "/admin/case",
          state: { openModal: true },
          permission: "create cases",
        },
        {
          name: "My Cases",
          url: "/admin/mycase",
          permission: "view cases",
        },
      ],
    },
    {
      label: "Agent Timelines",
      icon: FiBriefcase,
      permission: "view cases",
      children: [
        {
          name: "All Timelines",
          url: "/admin/agent-timelines",
          permission: "view cases",
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .map((item) => {
      if (item.children) {
        const children = item.children.filter((child) =>
          permissions.includes(child.permission),
        );

        return {
          ...item,
          children,
        };
      }

      return item;
    })
    .filter((item) => {
      // Parent without children
      if (!item.children) {
        return permissions.includes(item.permission);
      }

      // Parent with children
      return item.children.length > 0;
    });

  return (
    <div
      className={`flex h-screen flex-col bg-[#111827] text-gray-400 shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin  scrollbar-thumb-gray-700">
        {/* Logo */}
        <div
          className={`mb-6 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } px-4`}
        >
          {!collapsed && (
            <Link to="/">
              <div className="flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="PMS Logo"
                  className="h-14 rounded-xl w-auto object-contain"
                />
              </div>
            </Link>
          )}

          <button
            onClick={() => {
              if (closeSidebar) {
                closeSidebar(); // Mobile
              } else {
                setCollapsed(!collapsed); // Desktop
              }
            }}
            className="rounded-lg p-2 text-white transition hover:bg-[#374151]"
          >
            <FiMenu size={22} />
          </button>
        </div>
        {/* Main Menu */}
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const ItemIcon = item.icon;
            const hasChildren = !!item.children;
            const isActiveParent = activeTab === item.label;

            return (
              <li key={item.label}>
                {/* Main Item */}
                <div
                  onClick={() => {
                    if (collapsed) {
                      if (item.url) {
                        handleNavigate(item.url, item.label);
                      } else if (item.children?.length) {
                        handleNavigate(
                          item.children[0].url,
                          item.label,
                          item.label,
                          item.children[0].name,
                          item.children[0].state,
                        );
                      }
                    } else {
                      hasChildren
                        ? handleDropdown(item.label)
                        : handleNavigate(item.url, item.label);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 ${
                    isActiveParent
                      ? "bg-gradient-to-r from-[#EF4444] to-[#89101C] text-white shadow-lg"
                      : "text-gray-400 hover:bg-[#1f2937] hover:text-white"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      collapsed
                        ? "justify-center w-full"
                        : "flex-1 gap-3 min-w-0"
                    }`}
                  >
                    <span
                      className={`flex w-5 shrink-0 justify-center ${
                        collapsed ? "" : "mt-[2px]"
                      }`}
                    >
                      <ItemIcon
                        className={
                          isActiveParent
                            ? "text-white text-lg"
                            : "text-gray-400 text-lg"
                        }
                      />
                    </span>

                    {!collapsed && (
                      <span className="truncate font-medium">{item.label}</span>
                    )}
                  </div>

                  {hasChildren && !collapsed && (
                    <IoChevronDownSharp
                      className={`ml-2 shrink-0 text-sm transition-transform duration-300 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Dropdown */}
                {hasChildren && !collapsed && (
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
