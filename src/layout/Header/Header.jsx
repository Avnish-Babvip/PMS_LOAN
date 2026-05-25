import { useRef } from "react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TiThMenuOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { adminLogout } from "../../features/actions/authentication";
import { PiUserCircle } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";

export const Header = ({ setSidebarOpen }) => {
  const PAGE_CONFIG = {
    "/admin": {
      title: "Dashboard",
    },
    "/admin/user": {
      title: "Admin Users List",
      placeholder: "Search name, username or email...",
    },
    "/admin/customer": {
      title: "Customers List",
      placeholder: "Search name, username or email...",
    },
    "/admin/customer/kyc": {
      title: "Customers Kyc Document List",
      placeholder: "Search name",
    },
    "/admin/customer/subscribe": {
      title: "Subscribers List",
      placeholder: "Search email",
    },
    "/admin/customer/contact": {
      title: "Contact List",
    },
    "/admin/role": {
      title: "Role List",
    },
    "/admin/permission": {
      title: "Permission List",
      placeholder: "Search name or module...",
    },
    "/admin/category": {
      title: "Category List",
    },
    "/admin/attribute": {
      title: "Attribute List",
    },
    "/admin/product": {
      title: "Product List",
      placeholder: "Search product name ",
    },
    "/admin/rider": {
      title: "Rider List",
      placeholder: "Search rider name ",
    },
    "/admin/rider/referral": {
      title: "Rider Referral List",
    },
    "/admin/rider/kyc": {
      title: "Rider Kyc Approval List",
      placeholder: "Search rider",
    },
    "/admin/rider/commission": {
      title: "Rider Commission",
    },
    "/admin/order": {
      title: "Order List",
      placeholder: "Search customer or order number ",
    },
    "/admin/order/assigned": {
      title: "Assigned Order List",
      placeholder: "Search rider or order number ",
    },
    "/admin/order/unassigned": {
      title: "Unassigned Order List",
      placeholder: "Search customer or order number ",
    },
    "/admin/order/download": {
      title: "Download Orders Sheet",
    },
    "/admin/coupon": {
      title: "Coupon List",
      placeholder: "Search coupon code",
    },
    "/admin/offer": {
      title: "Offer List",
      placeholder: "Search offer name",
    },
    "/admin/tax": {
      title: "Taxes List",
    },
    "/admin/settings/order-settings": {
      title: "Order Settings",
      placeholder: "Search pincode number",
    },
    "/admin/settings/location": {
      title: "Location",
    },
    "/admin/settings/company-info": {
      title: "Company Information",
    },
    "/admin/settings/delivery-pincode": {
      title: "Delivery Pincode List",
      placeholder: "Search pincode number",
    },
    "/admin/settings/site-settings": {
      title: "Site Settings",
    },
    "/admin/settings/payment-gateway": {
      title: "Payment Gateway List",
    },
    "/admin/cms/home-section": {
      title: "Home Section ",
    },
    "/admin/cms/app-banner": {
      title: "App Banner ",
    },
    "/admin/cms/about-us": {
      title: "About Us",
    },
    "/admin/cms/faq": {
      title: "Faq ",
    },
    "/admin/cms/privacy-policy": {
      title: "Privacy Policy",
    },
    "/admin/cms/contact-us": {
      title: "Contact Us",
    },
    "/admin/cms/return-policy": {
      title: "Return Policy",
    },
    "/admin/cms/terms-conditions": {
      title: "Terms & Conditions",
    },
    "/admin/maintenance/mode": {
      title: "Maintenance Setting",
    },
    "/admin/maintenance/contact": {
      title: "Maintenance Contact List",
    },

    "/rider": {
      title: "Rider Dashboard",
    },
    "/rider/order/assigned": {
      title: "Assigned Orders",
      placeholder: "Search name or order number ",
    },
    "/rider/profile": {
      title: "Your Rider Profile",
    },
    "/rider/referral/history": {
      title: "Rider History",
      placeholder: "Search name",
    },
  };

  const location = useLocation();
  const pageConfig = PAGE_CONFIG[location.pathname] || {};
  const enableSearch = Boolean(pageConfig.placeholder);

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";

  // 🔹 local input state (for debounce)
  const [input, setInput] = useState(urlSearch);

  /* =========================
     SYNC URL → INPUT
  ========================= */
  useEffect(() => {
    setInput(urlSearch);
  }, [urlSearch]);

  /* =========================
     CLEAR SEARCH ON ROUTE CHANGE
  ========================= */
  useEffect(() => {
    if (!enableSearch && searchParams.has("search")) {
      const params = Object.fromEntries(searchParams.entries());
      delete params.search;
      setSearchParams(params);
      setInput("");
    }
  }, [enableSearch]);

  /* =========================
     DEBOUNCE → URL
  ========================= */
  useEffect(() => {
    if (!enableSearch) return;

    const handler = setTimeout(() => {
      const params = Object.fromEntries(searchParams.entries());

      if (input.trim()) {
        setSearchParams({ ...params, search: input.trim(), page: 1 });
      } else {
        delete params.search;
        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [input, enableSearch]);

  return (
    <header className="flex items-center justify-between md:justify-between w-full px-6 py-4 bg-[#f9f7f7] text-[#5d7186]">
      <button
        className="text-gray-300 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <TiThMenuOutline className="text-gray-500 text-xl" />
      </button>

      <div className="hidden md:block text-lg text-gray-500 uppercase tracking-tight font-semibold">
        {pageConfig.title || " "}
      </div>
      {/* 🔍 SEARCH BAR */}
      {enableSearch && (
        <div className="relative  items-center w-full mx-2 md:hidden bg-[#eae8e8] rounded-full px-4 py-2.5">
          <input
            type="text"
            value={input}
            placeholder={pageConfig.placeholder}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-500"
          />
        </div>
      )}
      <div className="flex items-center  ">
        {/* 🔍 SEARCH BAR */}
        {enableSearch && (
          <div className="relative hidden md:flex items-center w-full ms-6 md:w-[260px] bg-[#eae8e8] rounded-full px-4 py-2.5">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              value={input}
              placeholder={pageConfig.placeholder}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-500"
            />
          </div>
        )}

        <AccountSection />
      </div>
    </header>
  );
};

function AccountSection({}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const { profileData } = useSelector((state) => state.customer);
  const { adminData } = useSelector((state) => state.authentication);
  const admin = adminData?.admin;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLogout());
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // useEffect(() => {
  //   dispatch(getCustomerDetails());
  // }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* ================= BUTTON ================= */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-brand-green transition-all duration-200"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full text-brand-green">
          <PiUserCircle size={24} className="text-lg" />
        </div>

        <span className="hidden md:block">
          Hi, {admin?.name?.split(" ")[0] || "User"}
        </span>

        <FiChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180 text-brand-green" : ""
          }`}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      <div
        className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl z-50 shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* USER HEADER */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">{admin?.name}</p>
          <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
        </div>

        {/* MENU ITEMS */}
        <div className="py-2">
          <NavLink
            to="profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-5 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-emerald-50 text-brand-green font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="change-password"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-5 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-emerald-50 text-brand-green font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Change Password
          </NavLink>

          <div className="my-2 border-t border-gray-100" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
