import { apiService } from "@/services/api.service";
import { IPagination, IPaginationState } from "@/types/interfaces/pagination";

interface ExamSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  name: string;
  description: string;
  scoringSystem: string;
}

export async function listExamSessionApi(pagination: IPaginationState) {
  return apiService.get<IPagination<ExamSession>>(`/exam-sessions`, {
    params: {
      limit: pagination.itemsPerPage,
      page: pagination.page,
      s: JSON.stringify({
        $or: [
          { name: { $cont: pagination.search } },
          { description: { $cont: pagination.search } },
          { scoringSystem: { $cont: pagination.search } },
        ],
      }),
    },
  });
}
