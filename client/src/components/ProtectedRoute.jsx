// make a protected route component that will check if the user is logged in and if not, it will redirect to the login page

import { Navigate } from "react-router";
import { useUserStore } from "../../store/user";
import { Outlet } from "react-router";
const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
