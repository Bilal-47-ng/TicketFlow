import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPagePage";
import Dashboard from "../features/tickets/pages/Dashboard";
import TicketsPage from "../features/tickets/pages/TicketsPage";
import TicketDetailPage from "../features/tickets/pages/TicketDetailsPage";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/tickets",
    element: <TicketsPage />,
  },
  {
    path: "/tickets/:id",
    element: <TicketDetailPage />,
  },
]);

export { router };
