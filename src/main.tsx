import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import { action as LoginPageAction } from "./systemComponents/LoginForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import Dashboard, { loader as DashboardLoader } from "./pages/Dashboard";
import UsersPage, {
  loader as UsersPageLoader,
  action as UsersPageAction,
} from "./pages/UsersPage";
import MyCalendar from "./pages/MyCalendar";
import {
  loader as MyCalendarLoader,
  action as MyCalendarAction,
} from "./systemComponents/Calendar";
import MyStudent from "./pages/MyStudent";
import Schedules, {
  loader as SchedulesLoader,
  action as SchedulesAction,
} from "./pages/Schedules";
import ManageProfile from "./pages/ManageProfile";
import Settings from "./pages/Settings";
import { action as DestroyUser } from "./destroy/destroyUser";
import { action as DestroySchedule } from "./destroy/destroySchedule";
import { Toaster } from "@/components/ui/sonner";
import UsersErrorPage from "./ErrorResponses/UsersErrorPage";
import { isAuthenticated } from "./utils/auth";
import { redirect } from "react-router-dom";
// Loader to protect /landing page route
const landingPageLoader = () => {
  if (isAuthenticated()) {
    return redirect("/dashboard"); // Redirect to dashboard if already logged in
  }
  return null; // Proceed if not authenticated
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    action: LoginPageAction,
    loader: landingPageLoader, // Apply the loader to protect landing page
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: DashboardLoader,
    children: [
      {
        path: "users",
        element: <UsersPage />,
        loader: UsersPageLoader,
        action: UsersPageAction,
        errorElement: <UsersErrorPage />,
        children: [
          {
            path: ":userId/destroy",
            action: DestroyUser,
          },
        ],
      },
      {
        path: "calendar",
        element: <MyCalendar />,
        loader: MyCalendarLoader,
        action: MyCalendarAction,
        children: [
          {
            path: ":scheduleId/destroy",
            action: DestroySchedule,
          },
        ],
      },
      {
        path: "students",
        element: <MyStudent />,
      },
      {
        path: "schedules",
        element: <Schedules />,
        loader: SchedulesLoader,
        action: SchedulesAction,
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
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
