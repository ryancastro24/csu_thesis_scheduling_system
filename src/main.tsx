import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import MyCalendar from "./pages/MyCalendar";
import MyStudent from "./pages/MyStudent";
import Schedules from "./pages/Schedules";
import ManageProfile from "./pages/ManageProfile";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "calendar",
        element: <MyCalendar />,
      },
      {
        path: "students",
        element: <MyStudent />,
      },
      {
        path: "schedules",
        element: <Schedules />,
      },

      {
        path: "manageprofile",
        element: <ManageProfile />,
      },

      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
