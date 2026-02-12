import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import { action as LoginPageAction } from "./systemComponents/LoginForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import PDFViewerComponent from "./pages/PDFViewerComponent";
import Dashboard, {
  loader as DashboardLoader,
  action as DashboardAction,
} from "./pages/Dashboard";
import UsersPage, {
  loader as UsersPageLoader,
  action as UsersPageAction,
} from "./pages/UsersPage";
import MyCalendar from "./pages/MyCalendar";
import {
  loader as MyCalendarLoader,
  action as MyCalendarAction,
} from "./systemComponents/Calendar";
import MyStudent, {
  loader as MyStudentLoader,
  action as MyStudentAction,
} from "./pages/MyStudent";
import Schedules, {
  loader as SchedulesLoader,
  action as SchedulesAction,
} from "./pages/Schedules";
import ManageProfile, {
  loader as ManageProfileLoader,
  action as ManageProfileAction,
} from "./pages/ManageProfile";

import { action as DestroyUser } from "./destroy/destroyUser";
import { action as DestroySchedule } from "./destroy/destroySchedule";
import { Toaster } from "@/components/ui/sonner";
import UsersErrorPage from "./ErrorResponses/UsersErrorPage";
import LandingPage from "./pages/LandingPage";
import { isAuthenticated, getUserData } from "./utils/auth";
import { redirect } from "react-router-dom";
import Favorites, {
  loader as FavoritesLoader,
  action as FavoritesAction,
} from "./pages/Favorites";
import { action as UserApprovalAction } from "./systemComponents/UserApproval";
import { action as DestroyThesisDocument } from "./destroy/destroyThesisDocument";
import LogsPage, { loader as LogsPageLoader } from "./pages/LogsPage";
import ThesisSection, {
  loader as ThesisSectionLoader,
  action as ThesisSectionAction,
} from "./pages/ThesisSection";
import PanelApprovals, {
  loader as PanelApprovalsLoaders,
  action as PanelApprovalsAction,
} from "./pages/PanelApprovals";
import Proposals, {
  loader as ProposalsLoader,
  action as ProposalsAction,
} from "./pages/Proposals";
// Loader to protect /landing page route
import AdviseeComponent, {
  loader as AdviseeComponentLoader,
  action as AdviseeComponentAction,
} from "./pages/AdviseeComponent";
import StudentActualDefense, {
  loader as StudentActualDefenseLoader,
} from "./pages/StudentActualDefense";

const landingPageLoader = () => {
  const userData = getUserData(); // Debug log to check userData retrieval
  if (
    (isAuthenticated() && userData?.userType === "faculty") ||
    userData?.userType === "admin"
  ) {
    return redirect("/dashboard"); // Redirect to dashboard if already logged in
  }

  if (isAuthenticated() && userData?.userType === "student") {
    return redirect("/dashboard/thesisSection"); // Redirect to dashboard if already logged in
  }
  return null; // Proceed if not authenticated
};
import ErrorCatcher from "./ErrorResponses/ErrorCatcher";

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
    action: DashboardAction,
    errorElement: <ErrorCatcher />, // 👈 HERE
    children: [
      {
        element: <LandingPage />,
        index: true,
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

          {
            path: ":userId/approve",
            action: UserApprovalAction,
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
        loader: MyStudentLoader,
        action: MyStudentAction,
        children: [],
      },
      {
        path: "advisees",
        element: <AdviseeComponent />,
        loader: AdviseeComponentLoader,
        action: AdviseeComponentAction,
      },
      {
        path: "thesisSection",
        element: <ThesisSection />,
        loader: ThesisSectionLoader,
        action: ThesisSectionAction,
      },
      {
        path: "schedules",
        element: <Schedules />,
        loader: SchedulesLoader,
        action: SchedulesAction,
        children: [
          {
            path: ":caseId/destroy",
            action: DestroyThesisDocument,
          },
        ],
      },

      {
        path: "manageprofile",
        element: <ManageProfile />,
        loader: ManageProfileLoader,
        action: ManageProfileAction,
      },

      {
        path: "proposals",
        element: <Proposals />,
        loader: ProposalsLoader,
        action: ProposalsAction,
      },

      {
        path: "panelProposals",
        element: <PanelApprovals />,
        loader: PanelApprovalsLoaders,
        action: PanelApprovalsAction,
      },

      {
        path: "logs",
        element: <LogsPage />,
        loader: LogsPageLoader,
      },
      {
        path: "favorites",
        element: <Favorites />,
        loader: FavoritesLoader,
        action: FavoritesAction,
      },

      {
        path: "studentActualDefense",
        element: <StudentActualDefense />,
        loader: StudentActualDefenseLoader,
      },

      {
        path: "view",
        element: <PDFViewerComponent />,
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
  </StrictMode>,
);
