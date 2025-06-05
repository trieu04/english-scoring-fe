import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PencilIcon, MicIcon } from "lucide-react";

interface ScoringRowProps {
  type: "Writing" | "Speaking";
  icon: React.ReactNode;
}

function ScoringRow({ type, icon }: ScoringRowProps) {
  return (
    <div className="flex items-center gap-8 p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{type}</span>
      </div>
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium">Overall</span>
        <span>=</span>
        <div className="flex items-center gap-2 flex-1">
          <ScoringBox label="Task 1" value="0.25" color="cyan" />
          <span>+</span>
          <ScoringBox label="Task 2" value="0.4" color="pink" />
          <span>+</span>
          <ScoringBox label="Task 3" value="0.35" color="orange" />
          <span>+</span>
          <ScoringBox label="Task 4" value="0.35" color="purple" />
        </div>
      </div>
    </div>
  );
}

interface ScoringBoxProps {
  label: string;
  value: string;
  color: "cyan" | "pink" | "orange" | "purple";
}

function ScoringBox({ label, value, color }: ScoringBoxProps) {
  const colorClasses = {
    cyan: "bg-cyan-50 border-cyan-200",
    pink: "bg-pink-50 border-pink-200",
    orange: "bg-orange-50 border-orange-200",
    purple: "bg-purple-50 border-purple-200",
  };

  const textColorClasses = {
    cyan: "text-cyan-600",
    pink: "text-pink-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]} flex flex-col items-center min-w-[80px]`}>
      <span className={`text-sm font-medium ${textColorClasses[color]}`}>{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("vstep");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Scoring system</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="vstep">Vstep</TabsTrigger>
          <TabsTrigger value="custom">My_custom</TabsTrigger>
        </TabsList>

        <TabsContent value="vstep">
          <Card className="p-6 space-y-6">
            <ScoringRow
              type="Writing"
              icon={<PencilIcon className="w-5 h-5 text-blue-500" />}
            />
            <ScoringRow
              type="Speaking"
              icon={<MicIcon className="w-5 h-5 text-blue-500" />}
            />
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card className="p-6 space-y-6">
            <ScoringRow
              type="Writing"
              icon={<PencilIcon className="w-5 h-5 text-blue-500" />}
            />
            <ScoringRow
              type="Speaking"
              icon={<MicIcon className="w-5 h-5 text-blue-500" />}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
