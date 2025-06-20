import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pane } from "@/components/ui/pane";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { clsx } from "clsx";
import { DownloadIcon, ExternalLink, Trash2Icon, UploadIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { listExamSessionApi } from "../apis/exams.api";

export function HistoryPage() {
  const [tableState, setTableState] = useState({
    itemsPerPage: 10,
    page: 1,
    search: "",
    searchInput: "",
  });

  const listExamSessionQuery = useQuery({
    queryKey: ["scoringSessions", tableState.itemsPerPage, tableState.page, tableState.search],
    queryFn: () => listExamSessionApi(tableState),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
        placement: "topRight",
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

  return (
    <Pane header="Submission history" isLoading={listExamSessionQuery.isLoading}>
      {/* Filter/Search Bar */}
      <div className="flex justify-end items-center mb-4 gap-2">
        <div className="relative w-64">
          <Input
            className="pl-10 pr-4 bg-[#f7f9fa] border rounded-full"
            placeholder="Search"
            value={tableState.searchInput}
            onChange={(e) => { setTableState(p => ({ ...p, searchInput: e.target.value })); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTableState(p => ({ ...p, page: 1, search: p.searchInput }));
              }
            }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </span>
        </div>
        <Button className="rounded-full flex items-center gap-2 px-4 py-2 bg-[#f7f9fa] border text-gray-700" variant="outline">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h6" /></svg>
          <span>Filter by</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
        </Button>
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
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: tableData?.pageCount }).map((_, i) => (
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
        ))}
      </div>
    </Pane>
  );
}
