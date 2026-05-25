import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";
import AdminDefaultLayout from "../layout/DefaultLayout/AdminDefaultLayout";
import Login from "../pages/Authentication/Login";
import LoginOTP from "../pages/Authentication/LoginOTP";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { NotFound } from "../pages/NotFound";
import ResetPassword from "../pages/Authentication/ResetPassword";
import AdminUser from "../pages/AdminUser/AdminUser";
import Customer from "../pages/Customer/Customer";
import Role from "../pages/Role/Role";
import Permission from "../pages/Permission/Permission";
import RolePermission from "../pages/Role/RolePermission";
import Category from "../pages/Category/Category";
import Attribute from "../pages/Attribute/Attribute";
import SubCategory from "../pages/Category/SubCategory";
import AttributeValue from "../pages/Attribute/AttributeValue";
import Product from "../pages/Product/Product";
import AddBulkProduct from "../pages/Product/AddBulkProduct";
import AddZipImages from "../pages/Product/AddZipImages";
import Rider from "../pages/Rider/Rider";
import RiderReferral from "../pages/Rider/RiderReferral";
import Order from "../pages/Order/Order";
import AssignOrder from "../pages/Order/AssignOrder";
import RiderAssignOrder from "../pages/RiderDashboard/RiderAssignOrder";
import UnassignOrder from "../pages/Order/UnAssignOrder";
import RiderKyc from "../pages/Rider/RiderKyc";
import CustomerKyc from "../pages/Customer/CustomerKyc";
import RiderProfile from "../pages/RiderDashboard/RiderProfile";
import ProtectedRoute from "../components/ProtectedRoutes";
import RiderOrderHistory from "../pages/RiderDashboard/RiderOrderHistory";
import Profile from "../pages/Profile/Profile";
import { RiderDashboard } from "../pages/RiderDashboard/RiderDashboard";
import RiderWallet from "../pages/RiderDashboard/RiderWallet";
import RiderWalletHistory from "../pages/RiderDashboard/RiderWalletHistory";
import RiderReferralCode from "../pages/RiderDashboard/RiderReferralCode";
import RiderCommission from "../pages/RiderDashboard/RiderCommission";
import RiderReferralHistory from "../pages/RiderDashboard/RiderReferralHistory";
import Commission from "../pages/Commission/Commission";
import Coupon from "../pages/Coupon/Coupon";
import Offer from "../pages/Offer/Offer";
import State from "../pages/Location/State/State";
import Company from "../pages/Company/Company";
import Tax from "../pages/Tax/Tax";
import Setting from "../pages/Setting/Setting";
import DownloadOrder from "../pages/Order/DownloadOrder";
import ChangePassword from "../pages/Authentication/ChangePassword";
import DeliveryPincode from "../pages/Location/DeliveryPincodes/DeliveryPincode";
import Subscriber from "../pages/Customer/Subscriber";
import Contact from "../pages/Customer/Contact";
import PaymentGateway from "../pages/PaymentGateway/PaymentGateway";
import Home from "../pages/Home/Home";
import AppBanner from "../pages/Home/AppBanner";
import SiteSettings from "../pages/Setting/SiteSettings";
import Faq from "../pages/CMS/Faq";
import AboutUs from "../pages/CMS/AboutUs";
import PrivacyPolicy from "../pages/CMS/PrivacyPolicy";
import TermsAndConditions from "../pages/CMS/Terms&Conditions";
import ReturnPolicy from "../pages/CMS/ReturnPolicy";
import ContactUs from "../pages/CMS/ContactUs";
import MaintenanceContact from "../pages/Maintenance/MaintenanceContact";
import MaintenanceMode from "../pages/Maintenance/MaintenanceMode";

export const appRouter = createBrowserRouter([
  /* ---------------- PUBLIC ROUTES ---------------- */
  {
    path: "/",
    element: <DefaultLayout />, // Public layout
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      { path: "login-otp", element: <LoginOTP /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },

  /* ---------------- PROTECTED ROUTES ---------------- */
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={[1]} />,
    children: [
      {
        element: <AdminDefaultLayout />,
        children: [
          { index: true, element: <Dashboard /> }, // 👈 this is "/admin"
          { path: "change-password", element: <ChangePassword /> },
          { path: "user", element: <AdminUser /> },
          { path: "profile", element: <Profile /> },
          { path: "customer", element: <Customer /> },
          { path: "customer/kyc", element: <CustomerKyc /> },
          { path: "customer/subscribe", element: <Subscriber /> },
          { path: "customer/contact", element: <Contact /> },
          { path: "role", element: <Role /> },
          { path: "permission", element: <Permission /> },
          { path: "role/:id", element: <RolePermission /> },
          { path: "category", element: <Category /> },
          { path: "category/:id", element: <SubCategory /> },
          { path: "attribute", element: <Attribute /> },
          { path: "attribute/:id", element: <AttributeValue /> },
          { path: "product", element: <Product /> },
          { path: "product/bulk-products", element: <AddBulkProduct /> },
          { path: "product/bulk-images", element: <AddZipImages /> },
          { path: "order", element: <Order /> },
          { path: "order/assigned", element: <AssignOrder /> },
          { path: "order/unassigned", element: <UnassignOrder /> },
          { path: "order/download", element: <DownloadOrder /> },
          { path: "rider", element: <Rider /> },
          { path: "rider/referral", element: <RiderReferral /> },
          { path: "rider/kyc", element: <RiderKyc /> },
          { path: "rider/commission", element: <Commission /> },
          { path: "coupon", element: <Coupon /> },
          { path: "offer", element: <Offer /> },
          { path: "tax", element: <Tax /> },
          { path: "settings/location", element: <State /> },
          { path: "settings/company-info", element: <Company /> },
          { path: "settings/order-settings", element: <Setting /> },
          { path: "settings/delivery-pincode", element: <DeliveryPincode /> },
          { path: "settings/payment-gateway", element: <PaymentGateway /> },
          { path: "settings/site-settings", element: <SiteSettings /> },
          { path: "cms/home-section", element: <Home /> },
          { path: "cms/app-banner", element: <AppBanner /> },
          { path: "cms/faq", element: <Faq /> },
          { path: "cms/about-us", element: <AboutUs /> },
          { path: "cms/privacy-policy", element: <PrivacyPolicy /> },
          { path: "cms/terms-conditions", element: <TermsAndConditions /> },
          { path: "cms/return-policy", element: <ReturnPolicy /> },
          { path: "cms/contact-us", element: <ContactUs /> },
          { path: "maintenance/contact", element: <MaintenanceContact /> },
          { path: "maintenance/mode", element: <MaintenanceMode /> },
        ],
      },
    ],
  },
  {
    path: "/rider",
    element: <ProtectedRoute allowedRoles={[6]} />,
    children: [
      {
        element: <AdminDefaultLayout />,
        children: [
          { index: true, element: <RiderDashboard /> }, // 👈 this is "/rider"
          { path: "change-password", element: <ChangePassword /> },
          { path: "order/assigned", element: <RiderAssignOrder /> },
          { path: "order/history", element: <RiderOrderHistory /> },
          { path: "wallet", element: <RiderWallet /> },
          { path: "wallet/history", element: <RiderWalletHistory /> },
          { path: "profile", element: <RiderProfile /> },
          { path: "referral", element: <RiderReferralCode /> },
          { path: "referral/history", element: <RiderReferralHistory /> },
          { path: "commission", element: <RiderCommission /> },
        ],
      },
    ],
  },

  /* ---------------- FALLBACK ---------------- */
  {
    path: "*",
    element: <NotFound />,
  },
]);
