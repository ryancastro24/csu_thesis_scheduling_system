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
import ManageProfile, {
  loader as ManageProfileLoader,
} from "./pages/ManageProfile";

import { action as DestroyUser } from "./destroy/destroyUser";
import { action as DestroySchedule } from "./destroy/destroySchedule";
import { Toaster } from "@/components/ui/sonner";
import UsersErrorPage from "./ErrorResponses/UsersErrorPage";
import LandingPage, {
  loader as LandingPageLoader,
  action as LandingPageAction,
} from "./pages/LandingPage";
import { isAuthenticated } from "./utils/auth";
import { redirect } from "react-router-dom";
import Favorites, {
  loader as FavoritesLoader,
  action as FavoritesAction,
} from "./pages/Favorites";

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
        element: <LandingPage />,
        index: true,
        loader: LandingPageLoader,
        action: LandingPageAction,
      },
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
        loader: ManageProfileLoader,
      },

      {
        path: "favorites",
        element: <Favorites />,
        loader: FavoritesLoader,
        action: FavoritesAction,
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
