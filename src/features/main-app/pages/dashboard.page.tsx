import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, DatePicker } from "antd";
import { useState } from "react";
import Icons from "@/components/icons";
import Illustrations from "@/components/illustrations";
import { Pane } from "@/components/ui/pane";
import { Pane2 } from "@/components/ui/pane2";
import { HistoryIcon } from "lucide-react";
import { Link } from "@/components/ui/link";

const scoringSystems = [
  { key: "vstep", label: "Vstep", color: "bg-sky-200", icon: <Icons.ExamMultipleChoiceIcon className="w-6 h-6 text-sky-700" /> },
  { key: "ielts", label: "IELTS", color: "bg-red-200", icon: <Icons.IeltsIcon className="w-6 h-6 text-red-700" /> },
  { key: "aptis", label: "Aptis", color: "bg-green-200", icon: <Icons.BookOpenIcon className="w-6 h-6 text-green-700" /> },
  { key: "other", label: "Other", color: "bg-indigo-200", icon: <Icons.FileTextIcon className="w-6 h-6 text-indigo-700" /> },
];

const scoringSystemCounts = {
  vstep: 600,
  ielts: 600,
  aptis: 600,
  other: 600,
};

const submissionsCount = 1247;

const barChartData = {
  scores: [9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
  frequencies: [280, 95, 120, 98, 170, 50, 220, 70, 210, 370, 170, 220, 370, 170, 220, 170, 150, 80, 50, 20],
};

const historySubmissions = [
  { id: 1, name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { id: 2, name: "Kip 2, 09/10/2024", time: "12:23", date: "04/12/2024" },
  { id: 3, name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { id: 4, name: "Kip 2, 09/10/2024", time: "12:23", date: "04/12/2024" },
  { id: 5, name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { id: 6, name: "Kip 2, 09/10/2024", time: "12:23", date: "04/12/2024" },
  { id: 7, name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { id: 8, name: "Kip 2, 09/10/2024", time: "12:23", date: "04/12/2024" },
  { id: 9, name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { id: 10, name: "Kip 2, 09/10/2024", time: "12:23", date: "04/12/2024" },
];

export function DashboardPage() {
  const [scoringSystem, setScoringSystem] = useState();
  const [task, setTask] = useState();
  const [dateRange, setDateRange] = useState([null, null]);

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
                <div className="text-4xl font-bold">{submissionsCount}</div>
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
                  {scoringSystems.map(sys => (
                    <div key={sys.key} className={`flex items-center justify-between rounded-lg px-3 py-2 ${sys.color}`}>
                      <div className="flex items-center gap-2">
                        {sys.icon}
                        <span className="font-semibold text-base">{sys.label}</span>
                      </div>
                      <span className="font-bold text-lg">{scoringSystemCounts[sys.key as "vstep" | "ielts" | "aptis" | "other"]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Chart */}
            <Card className="flex-[2] bg-[#fff7ec] p-0">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Scoring distribution all submissions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                {/* <BarChart
                xAxis={[{ data: barChartData.scores, label: "Score" }]}
                series={[{ data: barChartData.frequencies, label: "Frequency" }]}
                height={220}
                colors={["#3881A2"]}
                grid={{ horizontal: true }}
              /> */}
              </CardContent>
            </Card>
          </div>
          {/* Bottom: Scoring filter */}
          <Card className="p-6">
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
          </Card>
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
            <Link to="/dashboard" className="px-0">Detail</Link>
          </div>
        )}
        className="mx-0 col-span-2"
      >
        <div className="flex flex-col">
          {historySubmissions.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Icons.ExamMultipleChoiceIcon className="w-5 h-5 text-[#3881A2]" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-400">
                <span>
                  @
                  {item.time}
                </span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Pane2>
    </div>
  );
}
