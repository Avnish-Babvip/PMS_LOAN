import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DefaultLayout = () => {
  const { isAdminLoggedIn, adminData } = useSelector(
    (state) => state.authentication
  );

  const roleId = adminData?.admin?.role_id;

  // If logged in → redirect based on role
  if (isAdminLoggedIn) {
    if (roleId === 1) {
      return <Navigate to="/admin" replace />;
    }

    if (roleId === 6) {
      return <Navigate to="/rider" replace />;
    }
  }

  return <Outlet />;
};

export default DefaultLayout;