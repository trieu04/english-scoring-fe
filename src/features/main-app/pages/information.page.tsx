import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import readmeImg from "@/assets/img/information/readme.png";
import newSubmissionImg from "@/assets/img/information/new-submission.png";
import historyImg from "@/assets/img/information/history.png";
import statisticsImg from "@/assets/img/information/statistics.png";
import scoringSystemImg from "@/assets/img/information/scoring-system.png";
import userSettingImg from "@/assets/img/information/user-setting.png";
import { useState } from "react";

const tabContent: Record<string, { title: string; content: string }> = {
  "readme": {
    title: "Readme",
    content:
      "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.",
},
  "new-submission": { title: "New submission", content: "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people." },
  "history": { title: "History", content: "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people." },
  "statistics": { title: "Statistics", content: "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people." },
  "scoring-system": { title: "Scoring system", content: "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people." },
  "user-setting": { title: "User setting", content: "I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.\n\nHowever, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.  However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.\n\nI believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people." },
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
    <div className="flex flex-col items-center w-full h-full p-6 bg-[#f7f9fa]">
      <Card className="w-full mx-auto p-0 rounded-2xl shadow-lg border-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-2">
            <div className="text-3xl font-bold mb-2">System</div>
          </div>
          <div className="px-8">
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
                      onClick={() => {setCurrentTab(tab.value)} }
                    >
                      {tab.label}
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
        </CardContent>
      </Card>
    </div>
  );
}
