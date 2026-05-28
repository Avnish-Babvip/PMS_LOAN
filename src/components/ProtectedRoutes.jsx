import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  requiredPermission,
  children,
}) => {
  const { adminData } = useSelector(
    (state) => state.authentication
  );

  // User not logged in
  if (!adminData?.admin) {
    return <Navigate to="/login" replace />;
  }

  const permissions =
    adminData.admin.permissions || [];

  // Logged in but no permission
  if (
    requiredPermission &&
    !permissions.includes(requiredPermission)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;