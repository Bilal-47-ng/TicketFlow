import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings, Ticket } from "lucide-react";
import useLogout from "../../features/auth/hooks/useLogout";
import axios from "axios";
import type { ApiErrorResponse } from "../../features/auth/types/auth.types";

const navSharedStyles = `font-medium transition-colors flex items-center gap-3`;
const navStyles = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `bg-blue-600 text-white rounded-lg px-3 py-2 ${navSharedStyles}`
    : `text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg px-3 py-2 ${navSharedStyles}`;

function Sidebar() {
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
    <aside className="flex h-full w-64 shrink-0 flex-col bg-slate-900 p-4 text-white">
      <img
        src="/TicketFlowLogo.png"
        alt="TicketFlow logo"
        className="h-24 w-full object-contain mt-6"
      />
      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={navStyles}>
          <LayoutDashboard size={20} className="shrink-0" /> Dashboard
        </NavLink>

        <NavLink to="/tickets" className={navStyles}>
          <Ticket size={20} className="shrink-0" /> Tickets
        </NavLink>
      </nav>
      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-2 border-t border-slate-700 pt-4">
        <NavLink to="/settings" className={navStyles}>
          <Settings size={20} className="shrink-0" /> Settings
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-red-400 transition-colors hover:bg-slate-800 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50">
          <LogOut size={20} className="shrink-0" />
          {logoutMutation.isPending ? "Logout..." : "Logout"}
        </button>
        {logoutMutation.isError && (
          <p role="alert" className="text-xs text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
