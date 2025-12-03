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
import { NewScoringSystemPage } from "./pages/new-scoring-system";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";

const mainAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-app",
  component: MainAppLayout,
  beforeLoad: requireAuth,
});

const dashboardRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "dashboard",
  component: DashboardPage,
  validateSearch: z.object({
    isFromLogin: z.boolean().optional(),
  }),
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
  validateSearch: (search: {
    examSessionId?: string;
    examId?: string;
  }) => {
    return {
      examSessionId: search.examSessionId ?? undefined,
      examId: search.examId,
    };
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "settings",
  component: SettingsPage,
});

const newScoringSystemRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "settings/new-scoring-system",
  component: NewScoringSystemPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => mainAppRoute,
  path: "upload",
  component: UploadPage,
  validateSearch: (search) => {
    return {
      scoringSystem: z.string().optional().parse(search.scoringSystem),
      examSessionId: z.string().optional().parse(search.examSessionId),
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
  newScoringSystemRoute,
]);
