import { Card, Select, DatePicker } from "antd";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState } from "react";

const scoringData = [
  { value: 280, label: "9.5" },
  { value: 95, label: "9" },
  { value: 120, label: "8.5" },
  { value: 98, label: "8" },
  { value: 170, label: "7.5" },
  { value: 50, label: "7" },
  { value: 220, label: "6.5" },
  { value: 220, label: "6" },
  { value: 210, label: "5.5" },
  { value: 370, label: "5" },
  { value: 170, label: "4.5" },
  { value: 170, label: "4" },
  { value: 370, label: "3.5" },
  { value: 220, label: "3" },
  { value: 170, label: "2.5" },
  { value: 150, label: "2" },
  { value: 80, label: "1.5" },
  { value: 50, label: "1" },
  { value: 20, label: "0.5" },
];

export function DashboardPage() {
  const [scoringSystem, setScoringSystem] = useState("");
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#3498db] text-white">
          <div className="flex items-center">
            <div className="text-4xl mr-4">📝</div>
            <div>
              <div className="text-3xl font-bold">1247</div>
              <div>Submissions</div>
            </div>
          </div>
        </Card>

        {/* Scoring System Cards */}
        {["Vstep", "IELTS", "Aptis", "Other"].map(system => (
          <Card key={system} className="bg-white">
            <div>
              <div className={`text-lg font-medium ${
                system === "Vstep"
                  ? "text-[#3498db]"
                  : system === "IELTS"
                    ? "text-[#e74c3c]"
                    : system === "Aptis"
                      ? "text-[#2ecc71]"
                      : "text-[#9b59b6]"
              }`}
              >
                {system}
              </div>
              <div className="text-2xl font-bold mt-2">600</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="mb-6">
        <div className="text-lg font-bold mb-4">Scoring distribution all submissions</div>
        <div style={{ width: "100%", height: 400 }}>
          <BarChart
            series={[{ data: scoringData.map(d => d.value) }]}
            xAxis={[{ scaleType: "band", data: scoringData.map(d => d.label) }]}
            height={350}
          />
        </div>
      </Card>

      {/* Filters Section */}
      <Card title="Scoring">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">Scoring System</div>
            <Select
              className="w-full"
              placeholder="Select scoring system"
              value={scoringSystem}
              onChange={setScoringSystem}
              options={[
                { value: "vstep", label: "Vstep" },
                { value: "ielts", label: "IELTS" },
                { value: "aptis", label: "Aptis" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
          <div>
            <div className="mb-2">Task</div>
            <Select
              className="w-full"
              placeholder="Select task"
              value={task}
              onChange={setTask}
              options={[
                { value: "task1", label: "Task 1" },
                { value: "task2", label: "Task 2" },
              ]}
            />
          </div>
          <div>
            <div className="mb-2">Start day</div>
            <DatePicker
              className="w-full"
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div>
            <div className="mb-2">End date</div>
            <DatePicker
              className="w-full"
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
