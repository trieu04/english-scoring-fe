import { mockApiService } from "@/services/mock-api.service";

interface IExamSession {
  id: number;
  name: string;
}

interface IExamItem {
  id: number;
  code: string;
  name: string;
}

export async function getExamSessionListData() {
  return mockApiService.get<IExamSession[]>(`/mocks/scoring/exam-sessions.json`);
}

export async function getExamListData(_examSessionId: number) {
  return mockApiService.get<IExamItem[]>(`/mocks/scoring/exam-list.json`);
}
