import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pane } from "@/components/ui/pane";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleApiError } from "@/lib/error-handle";
import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Checkbox, notification, Popover } from "antd";
import { clsx } from "clsx";
import { DownloadIcon, ExternalLink, Trash2Icon, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

interface ScoringSystem {
  id: string;
  name: string;
  description: string;
}

interface ExamSession {
  id: string;
  no: number;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  name: string;
  description: string;
  scoringSystemName: string;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [tableState, setTableState] = useState({
    itemsPerPage: 10,
    page: 1,
    search: "",
    scoringSystemFilter: [] as string[],
  });

  const [tableInput, setTableInput] = useState({
    search: "",
    scoringSystemFilter: [] as string[],
  });

  const listExamSessionQuery = useQuery({
    queryKey: ["/exam-session", tableState],
    queryFn: () => {
      return apiService.get<PaginatedResult<ExamSession>>(`/exam-session`, {
        params: {
          limit: tableState.itemsPerPage,
          page: tableState.page,
          search: tableState.search,
          scoringSystemFilter: tableState.scoringSystemFilter,
        },
      });
    },
  });

  const listScoringSystemQuery = useQuery({
    queryKey: ["/scoring-system"],
    queryFn: () => {
      return apiService.get<ScoringSystem[]>("/scoring-system");
    },
  });

  const tableData = useMemo(() => {
    const blankTableData = {
      rows: [],
      currentPage: 1,
      totalItems: 0,
      totalPages: 1,
    };
    if (listExamSessionQuery.isSuccess) {
      const { data: rows, meta: { currentPage, totalItems, totalPages } } = listExamSessionQuery.data;
      return { rows, currentPage, totalItems, totalPages };
    }

    return blankTableData;
  }, [listExamSessionQuery.isSuccess, listExamSessionQuery.data]);

  const listScoringSystemData = useMemo(() => {
    const blankData = [] as ScoringSystem[];

    if (listScoringSystemQuery.isSuccess) {
      return listScoringSystemQuery.data;
    }
    return blankData;
  }, [listScoringSystemQuery.isSuccess, listScoringSystemQuery.data]);

  useEffect(() => {
    if (listExamSessionQuery.isError) {
      handleApiError(listExamSessionQuery.error, {
        customMessage: "Failed to load exam sessions",
      });
    }
  }, [listExamSessionQuery.isError, listExamSessionQuery.error]);

  useEffect(() => {
    if (listScoringSystemQuery.isError) {
      handleApiError(listScoringSystemQuery.error, {
        customMessage: "Failed to load scoring systems",
      });
    }
  }, [listScoringSystemQuery.isError, listScoringSystemQuery.error]);

  const deleteExamSession = async (examSessionId: string) => {
    try {
      await apiService.delete(`/exam-session/${examSessionId}`);
      notification.success({
        message: "Submission deleted successfully",
      });
      // Refetch the exam sessions after deletion
      listExamSessionQuery.refetch();
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to delete submission",
      });
    }
  };

  const isLoading = listExamSessionQuery.isLoading || listScoringSystemQuery.isLoading;

  return (
    <Pane title="Submission history" isLoading={isLoading}>
      {/* Filter/Search Bar */}
      <div className="flex justify-end items-center mb-4 gap-2">
        <div className="relative w-64">
          <Input
            className="pl-10 pr-4 bg-[#f7f9fa] border rounded-full"
            placeholder="Search"
            value={tableInput.search}
            onChange={(e) => { setTableInput(p => ({ ...p, search: e.target.value })); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTableState(p => ({ ...p, page: 1, search: tableInput.search }));
              }
            }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </span>
        </div>
        <Popover
          placement="bottomRight"
          arrow={false}
          trigger="click"
          title="Scoring System"
          content={(
            <div className="flex flex-col items-start">
              {listScoringSystemData.map(item => (
                <Checkbox
                  className=""
                  checked={tableInput.scoringSystemFilter.includes(item.id)}
                  onChange={(e) => {
                    const newFilter = e.target.checked
                      ? [...tableInput.scoringSystemFilter, item.id]
                      : tableInput.scoringSystemFilter.filter(v => v !== item.id);
                    setTableInput(p => ({ ...p, scoringSystemFilter: newFilter }));
                  }}
                  key={item.id}
                >
                  {item.name}
                </Checkbox>
              ))}
              <div className="mt-2">
                <Button onClick={() => { setTableState(p => ({ ...p, scoringSystemFilter: tableInput.scoringSystemFilter })); }}>
                  <span className="text-sm">Apply</span>
                </Button>
              </div>

            </div>
          )}
        >
          <div className="rounded-full flex items-center gap-2 px-4 py-2 h-9 bg-gray-100 border-input border shadow-xs cursor-pointer">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h6" /></svg>
            <span>Filter by</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
          </div>
        </Popover>
      </div>
      {/* Table */}
      <div className="rounded-xl border-1 border-gray-300 overflow-hidden">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border-gray-300">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Scoring System</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.rows.map((row, idx) => (
              <TableRow key={row.id} className={idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}>
                <TableCell className="text-center">{row.no}</TableCell>
                <TableCell
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    navigate({ to: `/scoring`, search: { examSessionId: row.id, examId: undefined } });
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell>{row.scoringSystemName}</TableCell>
                <TableCell>{dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button size="icon" variant="ghost" title="Download"><DownloadIcon className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost" title="Upload"><UploadIcon className="w-5 h-5 " /></Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Open"
                    onClick={() => {
                      navigate({ to: `/scoring`, search: { examSessionId: row.id, examId: undefined } });
                    }}
                  >
                    <ExternalLink className="w-5 h-5 " />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this submission?")) {
                        deleteExamSession(row.id);
                      }
                    }}
                  >
                    <Trash2Icon className="w-5 h-5 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tableData?.rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No submissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {
          Array.from({ length: tableData?.totalPages }).map((_, i) => (
            <Button
              key={i}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center border",
                tableState.page === i + 1 ? "bg-[#3881A2] text-white" : "bg-white text-[#3881A2]",
              )}
              onClick={() => setTableState(p => ({ ...p, page: i + 1 }))}
            >
              {i + 1}
            </Button>
          ))
        }
      </div>
    </Pane>
  );
}
