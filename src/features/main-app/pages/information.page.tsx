import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import readmeImg from "@/assets/img/information/readme.png";
import newSubmissionImg from "@/assets/img/information/new-submission.png";
import historyImg from "@/assets/img/information/history.png";
import statisticsImg from "@/assets/img/information/statistics.png";
import scoringSystemImg from "@/assets/img/information/scoring-system.png";
import userSettingImg from "@/assets/img/information/user-setting.png";
import { useState } from "react";
import { Pane } from "@/components/ui/pane";

const tabContent: Record<string, { title: string; content: string }> = {
  "readme": {
    title: "Readme",
    content:
      "This English Scoring App is designed to help learners assess their English proficiency across reading, writing, listening, and speaking. The app provides instant feedback with detailed explanations, helping users identify strengths and areas for improvement. \n\nKey features include AI-powered speech analysis, grammar correction, vocabulary enhancement, and real-time scoring based on CEFR standards. Whether you're preparing for exams like IELTS or TOEFL, or just improving your everyday English, this app offers a personalized path to success. \n\nThe intuitive interface and interactive exercises make learning engaging and effective. Your progress is tracked over time, allowing you to visualize improvements and set achievable goals.",
  },
  "new-submission": {
    title: "New submission",
    content:
      "Submitting your English test is easy. Simply select a test module, complete the tasks, and submit your responses for instant scoring. \n\nThe app uses advanced AI algorithms to evaluate grammar accuracy, vocabulary richness, pronunciation clarity, and fluency. Results are displayed with a breakdown of each skill area, offering actionable insights and tips to improve your English proficiency.\n\nYou can retake tests anytime to monitor progress and adjust your study plan based on your latest performance.",
  },
  "history": {
    title: "History",
    content:
      "The English Scoring App was created to address the need for an accessible, accurate, and user-friendly tool to assess English language skills. Since its launch, it has helped thousands of learners worldwide to benchmark their proficiency and achieve language goals.\n\nVersion updates have added features such as AI speech recognition, detailed writing analysis, and customized study recommendations. The app continues to evolve with user feedback, making it a trusted companion for English learners of all levels.",
  },
  "statistics": {
    title: "Statistics",
    content:
      "Your performance statistics are a core part of the English Scoring App. The dashboard presents your scores across all modules (Reading, Writing, Listening, Speaking) with easy-to-read charts and trends.\n\nYou can view average scores, highest achievements, and improvements over time. The app also compares your results to global benchmarks and suggests specific exercises to strengthen weaker areas.\n\nRegularly checking your statistics helps you stay motivated and focused on achieving your English learning goals.",
  },
  "scoring-system": {
    title: "Scoring system",
    content:
      "The app’s scoring system aligns with international English standards such as CEFR (A1–C2) and IELTS band scores. Each module (Reading, Writing, Listening, Speaking) is graded separately with detailed feedback.\n\nFor Speaking, AI evaluates pronunciation, intonation, and fluency. Writing is assessed for grammar accuracy, vocabulary range, and coherence. Listening and Reading are scored based on comprehension and speed.\n\nThe comprehensive system ensures a fair and accurate reflection of your English ability, making it ideal for both casual learners and test-takers.",
  },
  "user-setting": {
    title: "User setting",
    content:
      "Customize your English learning experience in the User Settings. Here, you can set your learning goals (e.g., daily practice time, target CEFR level), adjust notification preferences, and select your preferred English dialect (e.g., American, British).\n\nYou can also manage your profile, track progress milestones, and enable accessibility options for a more personalized journey. The app’s adaptive system adjusts exercises and test difficulty based on your performance and settings.",
  },
};

export function InformationPage() {
  const tabs = [
    { label: "Readme", value: "readme", img: readmeImg },
    { label: "New submission", value: "new-submission", img: newSubmissionImg },
    { label: "History", value: "history", img: historyImg },
    { label: "Statistics", value: "statistics", img: statisticsImg },
    { label: "Scoring system", value: "scoring-system", img: scoringSystemImg },
    { label: "User setting", value: "user-setting", img: userSettingImg },
  ];

  const [currentTab, setCurrentTab] = useState("readme");

  return (
    <Pane title="Information">
      <div className="flex flex-col items-center w-full h-full p-6">
        <div className="rounded-xl flex flex-col items-center justify-center min-h-[220px] mb-2 ">
          <img
            src={tabs.find(tab => tab.value === currentTab)?.img}
            alt="Scoring System"
            className="max-w-full  rounded mb-6"
            style={{ objectFit: "contain" }}
          />
          <Tabs defaultValue={tabs[0].value} className="w-full">
            <TabsList className="w-full flex gap-2 border-b bg-transparent rounded-none px-0 mb-2">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none bg-transparent h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#3881A2] text-base font-medium px-4 py-2"
                  onClick={() => { setCurrentTab(tab.value); }}
                >
                  <b>
                    {tab.label}
                  </b>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="flex flex-col items-center w-full pt-4 text-bold">
                <div className="w-full max-w-3xl mx-auto p-2">
                  <div className="text-2xl font-bold mb-2">{tabContent[tab.value].title}</div>
                  <div className="text-base whitespace-pre-line text-gray-700">
                    {tabContent[tab.value].content}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Pane>
  );
}
