import { mockApiService } from "@/services/mock-api.service";

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
  return mockApiService.get<IWritingSubmission>(`/mocks/scoring/${examId}/writing-submission.json`);
}

export async function getWritingScoringData(examId: number) {
  return mockApiService.get<IWritingScoring>(`/mocks/scoring/${examId}/writing-scoring.json`);
}
