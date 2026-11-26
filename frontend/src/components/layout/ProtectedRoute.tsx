import useCurrentUser from "../../features/auth/hooks/useCurrentUser";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { data, isLoading, isError } = useCurrentUser();
  return isLoading ? (
    "Loading....."
  ) : isError ? (
    <Navigate to="/login" replace />
  ) : data ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export { ProtectedRoute };
