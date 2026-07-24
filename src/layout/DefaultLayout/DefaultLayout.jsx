import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const DefaultLayout = () => {
  const location = useLocation();

  const { isAdminLoggedIn } = useSelector((state) => state.authentication);


  if (isAdminLoggedIn && location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default DefaultLayout;
