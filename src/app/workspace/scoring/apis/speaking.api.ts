import { mockApi } from "@/api/api";

export interface ISpeckingSubmission {
  id: number;
  audioUrl: string;
}

export interface ISpeckingScoring {
  id: number;
  version: string;
  scoringDetails: {
    overall: number;
    pronunciation: number;
    vocabulary: number;
    grammar: number;
    fluency: number;
    content: number;
  };
}

export interface ISpeakingVersions {
  versions: {
    id: number;
    time: string;
    date: string;
    version: number;
    scoringDetails: {
      overall: number;
      pronunciation: number;
      vocabulary: number;
      grammar: number;
      fluency: number;
      content: number;
    };
  }[];
}

export async function getSpeakingSubmissionData(examId: number) {
  return mockApi.get<ISpeckingSubmission>(`/mocks/scoring/${examId}/speaking-submission.json`).then(res => res.data);
}

export async function getSpeakingScoringData(examId: number) {
  return mockApi.get<ISpeckingScoring>(`/mocks/scoring/${examId}/speaking-scoring.json`).then(res => res.data);
}

export async function getSpeakingVersioningData(examId: number) {
  return mockApi.get<ISpeakingVersions>(`/mocks/scoring/${examId}/speaking-versions.json`).then(res => res.data);
}
