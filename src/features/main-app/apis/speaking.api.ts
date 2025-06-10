import { mockApiService } from "@/services/mock-api.service";

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
  return mockApiService.get<ISpeckingSubmission>(`/mocks/scoring/${examId}/speaking-submission.json`);
}

export async function getSpeakingScoringData(examId: number) {
  return mockApiService.get<ISpeckingScoring>(`/mocks/scoring/${examId}/speaking-scoring.json`);
}

export async function getSpeakingVersioningData(examId: number) {
  return mockApiService.get<ISpeakingVersions>(`/mocks/scoring/${examId}/speaking-versions.json`);
}
