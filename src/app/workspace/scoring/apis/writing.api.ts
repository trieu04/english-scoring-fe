import { api } from "@/api/api";

export interface IWritingSubmission {
  id: number;
  tasks: {
    no: number;
    text: string;
  }[];
}

export interface IWritingScoring {
  id: number;
  version: string;
  scoringDetails: {
    overall: number;
    organization: number;
    vocabulary: number;
    grammar: number;
  };
  explaination: string;
}

export async function getWritingSubmissionsData(examId: number) {
  return api.get<IWritingSubmission>(`/mocks/scoring/${examId}/writing-submission.json`).then(res => res.data);
}

export async function getWritingScoringData(examId: number) {
  return api.get<IWritingScoring>(`/mocks/scoring/${examId}/writing-scoring.json`).then(res => res.data);
}
