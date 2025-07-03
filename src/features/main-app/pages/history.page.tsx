import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pane } from "@/components/ui/pane";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {Checkbox, notification, Popover } from "antd";
import { clsx } from "clsx";
import { DownloadIcon, ExternalLink, Trash2Icon, UploadIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { apiService } from "@/services/api.service";
import { IPagination } from "@/types/interfaces/pagination";

interface ScoringSystem {
  id: string;
  name: string;
  description: string;
}

interface ExamSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  name: string;
  description: string;
  scoringSystem: string;
}

export function HistoryPage() {
  const [tableState, setTableState] = useState({
    itemsPerPage: 10,
    page: 1,
    search: "",
    scoringSystemFilter: [] as string[],
  });

  const [tableInput, setTableInput] = useState({
    search: "",
    scoringSystemFilter: [] as string[],
  })

  const listExamSessionQuery = useQuery({
    queryKey: ["scoringSessions", tableState],
    queryFn: () => {
      return apiService.get<IPagination<ExamSession>>(`/exam-sessions`, {
        params: {
          limit: tableState.itemsPerPage,
          page: tableState.page,
          s: JSON.stringify({
            $or: [
              { name: { $cont: tableState.search } },
              { description: { $cont: tableState.search } },
            ],
          }),
        },
      });
    },
  });

  const listScoringSystemQuery = useQuery({
    queryKey: ["listScoringSystem"],
    queryFn: () => {
      return apiService.get<IPagination<ScoringSystem>>("/scoring-systems", {
        params: {
          limit: 1000,
        },
      });
    },
  });

  const tableData = useMemo(() => {
    const blankTableData = {
      rows: [],
      count: 0,
      total: 0,
      page: 1,
      pageCount: 0,
    };

    const { isError, isSuccess, error, data } = listExamSessionQuery;
    if (isError) {
      notification.error({
        message: "Failed to load submission history",
        description: error.message,
      });
    }

    if (isSuccess) {
      const { data: rows, count, total, page, pageCount } = data;

      return {
        rows,
        count,
        total,
        page,
        pageCount,
      };
    }

    return blankTableData;
  }, [listExamSessionQuery]);

  const listScoringSystemData = useMemo(() => {
    const blankData = [] as ScoringSystem[];
    const { isError, isSuccess, error, data } = listScoringSystemQuery;
    if (isError) {
      notification.error({
        message: "Failed to load scoring systems",
        description: error.message,
      });
      return blankData;
    }
    if (isSuccess) {
      const { data: rows } = data;
      return rows;
    }
    return blankData;
  }, [listScoringSystemQuery]);

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
          placement="bottomRight" arrow={false} trigger="click"
          title="Scoring System"
          content={<div className="flex flex-col items-start">
            {listScoringSystemData.map((item) => (
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
            ))
            }
            <div className="mt-2">
              <Button onClick={() => { setTableState(p => ({ ...p, scoringSystemFilter: tableInput.scoringSystemFilter })); }}>
                <span className="text-sm">Apply</span>
              </Button>
            </div>

          </div>}
        >
          <div className="rounded-full flex items-center gap-2 px-4 py-2 h-9 bg-gray-100 border-input border shadow-xs cursor-pointer">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h6" /></svg>
            <span>Filter by</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
          </div>
        </Popover>
      </div >
      {/* Table */}
      < div className="rounded-xl border-1 border-gray-300 overflow-hidden" >
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
                <TableCell className="text-center">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.scoringSystem}</TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button size="icon" variant="ghost" title="Download"><DownloadIcon className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost" title="Upload"><UploadIcon className="w-5 h-5 " /></Button>
                  <Button size="icon" variant="ghost" title="Open"><ExternalLink className="w-5 h-5 " /></Button>
                  <Button size="icon" variant="ghost" title="Delete"><Trash2Icon className="w-5 h-5 text-red-500" /></Button>
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
      </div >
      {/* Pagination */}
      < div className="flex justify-center items-center gap-2 mt-6" >
        {
          Array.from({ length: tableData?.pageCount }).map((_, i) => (
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
      </div >
    </Pane >
  );
}
