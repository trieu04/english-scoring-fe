import { MainAppLayout } from "@/features/main-app/layout";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
import { DashboardPage } from "@/features/main-app/pages/dashboard.page";
import { HistoryPage } from "@/features/main-app/pages/history.page";
import { InformationPage } from "@/features/main-app/pages/information.page";
import { DashboardProfilePage } from "@/features/main-app/pages/profile.page";
import { ReportPage } from "@/features/main-app/pages/report.page";
import { ScoringPage } from "@/features/main-app/pages/scoring.page";
import { SettingsPage } from "@/features/main-app/pages/settings.page";
import { UploadPage } from "@/features/main-app/pages/upload.page";

const mainAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-app",
  component: MainAppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "dashboard",
  component: DashboardPage,
});

const historyRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "history",
  component: HistoryPage,
});

const informationRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "information",
  component: InformationPage,
});

const profileRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "profile",
  component: DashboardProfilePage,
});

const reportRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "report",
  component: ReportPage,
});

const scoringRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "scoring",
  component: ScoringPage,
  validateSearch: (search) => {
    return {
      examSession: search.examSession ?? undefined,
    };
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "settings",
  component: SettingsPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "upload",
  component: UploadPage,
  validateSearch: (search) => {
    return {
      scoringSystem: search.scoringSystem ?? undefined,
    };
  },
});

export const mainAppRouteTree = mainAppRoute.addChildren([
  dashboardRoute,
  scoringRoute,
  profileRoute,
  uploadRoute,
  historyRoute,
  informationRoute,
  reportRoute,
  settingsRoute,
]);
