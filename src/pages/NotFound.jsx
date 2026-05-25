import { Link } from "react-router-dom";
import { TbError404 } from "react-icons/tb";
import { useSelector } from "react-redux";

export const NotFound = () => {
  const { adminData } = useSelector((state) => state.authentication);

  const roleId = adminData?.admin?.role_id;

  // Decide home path based on role
  let homePath = "/login";

  if (roleId === 1) {
    homePath = "/admin";
  } else if (roleId === 6) {
    homePath = "/rider";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600 to-blue-900 rounded-full w-64 h-64 opacity-40"></div>
        <TbError404 className="relative text-[150px] text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
      </div>

      {/* Text */}
      <h1 className="text-4xl font-bold mt-6">Page Not Found</h1>
      <p className="text-gray-400 mt-2 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to={homePath}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-900 rounded-lg font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};