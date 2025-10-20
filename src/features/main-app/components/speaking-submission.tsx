import { useQuery } from "@tanstack/react-query";
import { Alert, Spin } from "antd";
import { apiService } from "@/services/api.service";
import { SpeakingSubmissionInterface } from "../types/scoring";
import { AudioPlayer } from "./audio-player";

export function SpeakingSubmissionComponent({
  speakingSubmissions,
}: {
  speakingSubmissions: SpeakingSubmissionInterface[];
}) {
  return (
    <div>
      {speakingSubmissions.some(part => part.questionText) && (
        <>
          <h3 className="mb-4">Task</h3>
          <div className="max-h-64 overflow-y-auto p-4 rounded-md border border-grey1 bg-line mb-4">
            {speakingSubmissions.map((part) => {
              if (part.questionText) {
                return (
                  <p key={part.taskNumber}>
                    <span className="font-bold">{`Part ${part.taskNumber}: `}</span>
                    {part.questionText}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </>
      )}
      <h3>Submission</h3>
      {
        speakingSubmissions.map(part => (
          <div key={part.taskNumber}>
            <div className="mt-3 ">
              <AudioPlayer url={part.answerFileUrl || ""} name={`Part ${part.taskNumber}`} />
            </div>
          </div>
        ))
      }
    </div>
  );
}
