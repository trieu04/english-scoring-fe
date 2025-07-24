import Icons from "@/components/icons";
import Illustrations from "@/components/illustrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Pane } from "@/components/ui/pane";
import { Pane2 } from "@/components/ui/pane2";
import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import { BarChart } from "@mui/x-charts/BarChart";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Spin } from "antd";
import { HistoryIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function DashboardPage() {
  const [scoringSystem, setScoringSystem] = useState();
  const [task, setTask] = useState();
  const [dateRange, setDateRange] = useState([null, null]);
  const listExamSessionQuery = useQuery({
    queryKey: ["/exam-session"],
    queryFn: () => {
      return apiService.get<PaginatedResult<{
        id: string;
        no: number;
        createdAt: string;
        updatedAt: string;
        userId: string | null;
        name: string;
        description: string;
        scoringSystemName: string;
      }>>(`/exam-session`, {
        params: {
          limit: 10,
          page: 1,
        },
      });
    },
  });

  const getDashboardQuery = useQuery({
    queryKey: ["/dashboard"],
    queryFn: () => {
      return apiService.get<{
        submissionCount: number;
        submissionCountByScoringSystem: {
          scoringSystemId: string;
          scoringSystemName: string;
          submissionCount: number;
        }[];
        overallDistributionOfAllSubmissions: {
          overall: string;
          count: string;
        }[];
      }>("/dashboard");
    },
  });

  const navigate = useNavigate();
  const { isFromLogin } = useSearch({ from: "/main-app/dashboard" });

  useEffect(() => {
    if (isFromLogin) {
      if (getDashboardQuery.isSuccess) {
        if (getDashboardQuery.data.submissionCount === 0) {
          navigate({
            to: "/information",
          });
        }
      }
    }
  }, [getDashboardQuery.isSuccess, isFromLogin]);

  const barChartData = useMemo(() => {
    if (!getDashboardQuery.data)
      return { scores: [], frequencies: [] };

    const scores = getDashboardQuery.data.overallDistributionOfAllSubmissions.map(item => Number.parseFloat(item.overall));
    const frequencies = getDashboardQuery.data.overallDistributionOfAllSubmissions.map(item => Number(item.count));

    return { scores, frequencies };
  }, [getDashboardQuery.data]);

  return (
    <div className="grid grid-cols-6 gap-4 px-4">
      <Pane title="Dashboard" className="mx-0 col-span-4">
        <div className="flex-1 flex flex-col gap-6">
          {/* Top: Submissions */}
          <Card className="bg-[#3881A2] text-white flex-row items-center p-6 h-32">
            <div className="flex items-center h-full">
              <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-white/20 mr-6">
                <Illustrations.ExamIllustration className="w-12 h-12" />
              </div>
              <div>
                <div className="text-base opacity-80">Submissions</div>
                <div className="text-4xl font-bold">{getDashboardQuery.data?.submissionCount || "-"}</div>
              </div>
            </div>
          </Card>
          {/* Middle: Scoring system + Chart */}
          <div className="flex gap-6">
            {/* Scoring system summary */}
            <Card className="flex-1 bg-[#eaf6fb] p-0 min-w-[220px] max-w-[260px]">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Scoring system</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="flex flex-col gap-4">
                  {getDashboardQuery.data?.submissionCountByScoringSystem.map((sys) => {
                    let colorClass = "bg-gray-200";
                    let icon = <Icons.FileTextIcon className="w-6 h-6 text-indigo-700" />;
                    switch (sys.scoringSystemName.toLowerCase()) {
                      case "vstep":
                        colorClass = "bg-sky-200";
                        icon = <Icons.ExamMultipleChoiceIcon className="w-6 h-6 text-sky-700" />;
                        break;
                      case "ielts":
                        colorClass = "bg-red-200";
                        icon = <Icons.IeltsIcon className="w-6 h-6 text-red-700" />;
                        break;
                      case "aptis":
                        colorClass = "bg-green-200";
                        icon = <Icons.BookOpenIcon className="w-6 h-6 text-green-700" />;
                        break;
                    }

                    return (
                      <div key={sys.scoringSystemId} className={`flex items-center justify-between rounded-lg px-3 py-2 ${colorClass}`}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="font-semibold text-base">{sys.scoringSystemName}</span>
                        </div>
                        <span className="font-bold text-lg">{sys.submissionCount}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {/* Chart */}
            <Card className="flex-[2] bg-[#fff7ec] p-0">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Scoring distribution all submissions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <BarChart
                  xAxis={[{ data: barChartData.scores, label: "Score" }]}
                  series={[{ data: barChartData.frequencies, label: "Frequency" }]}
                  height={220}
                  colors={["#3881A2"]}
                  grid={{ horizontal: true }}
                />
              </CardContent>
            </Card>
          </div>
          {/* Bottom: Scoring filter */}
          {/* <Card className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col min-w-[180px]">
                <span className="mb-1 text-sm text-gray-500">Scoring System</span>
                <Select
                  placeholder="Scoring System"
                  value={scoringSystem}
                  onChange={setScoringSystem}
                  options={scoringSystems.map(s => ({ label: s.label, value: s.key }))}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col min-w-[180px]">
                <span className="mb-1 text-sm text-gray-500">Task</span>
                <Select
                  placeholder="Task"
                  value={task}
                  onChange={setTask}
                  options={[
                    { label: "Task 1", value: 1 },
                    { label: "Task 2", value: 2 },
                    { label: "Task 3", value: 3 },
                  ]}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col min-w-[180px]">
                <span className="mb-1 text-sm text-gray-500">Start day</span>
                <DatePicker
                  placeholder="Start day"
                  value={dateRange[0]}
                  onChange={date => setDateRange([date, dateRange[1]])}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col min-w-[180px]">
                <span className="mb-1 text-sm text-gray-500">End date</span>
                <DatePicker
                  placeholder="End date"
                  value={dateRange[1]}
                  onChange={date => setDateRange([dateRange[0], date])}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </Card> */}
        </div>
      </Pane>
      {/* Right: History */}
      <Pane2
        header={(
          <div className="flex items-center px-4 pt-3 pb-2">
            <h2 className="text-lg font-semibold grow flex items-center gap-2">
              <HistoryIcon />
              <span>History</span>
            </h2>
            <Link to="/history" className="px-0">Detail</Link>
          </div>
        )}
        className="mx-0 col-span-2"
      >
        <div className="flex flex-col">
          {listExamSessionQuery.isLoading && <Spin />}
          {listExamSessionQuery.data && listExamSessionQuery.data.data.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Icons.ExamMultipleChoiceIcon className="w-5 h-5 text-[#3881A2]" />
                <span className="font-medium text-sm">{item.name || `Test ${idx + 1}`}</span>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-400">
                <span>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Pane2>
    </div>
  );
}
