import { useNavigate } from "react-router-dom";
import useLogout from "../../auth/hooks/useLogout";
import axios from "axios";
import type { ApiErrorResponse } from "../../auth/types/auth.types";

function Dashboard() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  }

  const errorMessage = axios.isAxiosError<ApiErrorResponse>(
    logoutMutation.error,
  )
    ? (logoutMutation.error.response?.data.message ?? "Network error")
    : "Something went wrong";

  return (
    <div>
      <div>
        <p>TicketFlow</p>
      </div>
      <main>
        <h1>Dashboard title</h1>
        <button onClick={handleLogout} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? "Logout..." : "Logout"}
        </button>
        {logoutMutation.isError && <p>{errorMessage}</p>}
      </main>
      <div>Welcome message</div>
    </div>
  );
}

export default Dashboard;
