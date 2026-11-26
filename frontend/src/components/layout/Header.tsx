import useCurrentUser from "../../features/auth/hooks/useCurrentUser";
import { UserRound } from "lucide-react";
function Header() {
  const { data, isLoading, isError } = useCurrentUser();

  return (
    <>
      <header className="h-16 px-6 bg-white border-b border-slate-200 flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold">TicketFlow</h1>
          <span className="text-slate-600">Support Management</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 p-2">
            <UserRound />
          </span>

          <div className="flex flex-col">
            <span>
              {isLoading ? "Loading..." : isError ? "User" : data?.data.email}
            </span>
            <span>User</span>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
