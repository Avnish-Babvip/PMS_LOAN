import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { adminData } = useSelector((state) => state.authentication);
  const roleId = adminData?.admin?.role_id;

  if (!adminData) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(roleId))
    return <Navigate to="/" replace />;

  return <Outlet />;
  
};

export default ProtectedRoute;