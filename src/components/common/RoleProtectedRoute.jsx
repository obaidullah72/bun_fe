import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

function RoleProtectedRoute({ allowedRoles, children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleProtectedRoute;