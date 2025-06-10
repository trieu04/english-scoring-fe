import { api } from "@/api/api";

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
  return api.get<IExamSession[]>(`/mocks/scoring/exam-sessions.json`).then(res => res.data);
}

export async function getExamListData(_examSessionId: number) {
  return api.get<IExamItem[]>(`/mocks/scoring/exam-list.json`).then(res => res.data);
}
