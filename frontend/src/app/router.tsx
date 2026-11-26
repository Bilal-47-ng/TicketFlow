import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard from "../features/tickets/pages/Dashboard";
import TicketsPage from "../features/tickets/pages/TicketsPage";
import TicketDetailPage from "../features/tickets/pages/TicketDetailsPage";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
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
        ],
      },
    ],
  },
]);

export { router };
