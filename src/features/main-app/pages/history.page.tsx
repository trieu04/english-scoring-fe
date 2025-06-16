import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icons from "@/components/icons";
import { useState } from "react";
import { DownloadIcon } from "lucide-react";

// const mockRows = Array.from({ length: 12 }).map((_, i) => ({
//   id: i + 1,
//   name: "Kì thi ngày 30/4",
//   scoringSystem: "Aptis",
//   date: "1/2/2025",
// }));

const scoringSystems = ["Aptis", "IELTS", "TOEIC", "Cambridge", "Nội bộ"];

const rawData = [
  { name: "Nguyễn Đức Lộc", time: "12:23", date: "04/12/2024" },
  { name: "Kip 2, 09/10/2024", time: "12:24", date: "04/12/2024" },
  { name: "Kì thi nội bộ 13/4", time: "10:23", date: "04/12/2024" },
  { name: "Thi HSG cấp trường", time: "09:23", date: "04/12/2024" },
  { name: "Nguyễn Xuân Hoa", time: "08:23", date: "04/12/2024" },
  { name: "Kip 1", time: "18:23", date: "04/12/2024" },
  { name: "Thi nội bộ ", time: "22:23", date: "04/12/2024" },
  { name: "Thi cấp Tỉnh", time: "19:23", date: "04/12/2024" },
  { name: "Kiểm tra tuần", time: "01:23", date: "04/12/2024" },
  { name: "Lấy chứng chỉ", time: "00:23", date: "04/12/2024" },
  { name: "Thi HSG cấp trường", time: "09:23", date: "04/12/2024" },
  { name: "Nguyễn Xuân Hoa", time: "08:23", date: "04/12/2024" },
  { name: "Kip 1", time: "18:23", date: "04/12/2024" },
  { name: "Thi nội bộ ", time: "22:23", date: "04/12/2024" },
  { name: "Thi cấp Tỉnh", time: "19:23", date: "04/12/2024" },
  { name: "Kiểm tra tuần", time: "01:23", date: "04/12/2024" },
  { name: "Lấy chứng chỉ", time: "00:23", date: "04/12/2024" },
];

const mockRows = rawData.map((item, i) => ({
  id: i + 1,
  name: item.name,
  time: item.time,
  date: item.date,
  scoringSystem: scoringSystems[Math.floor(Math.random() * scoringSystems.length)],
}));


const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(mockRows.length / 10);


export function HistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filtered and paginated data (mocked)
  const filteredRows = mockRows.filter(row => row.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 bg-[#f7f9fa] min-h-full">
      {/* <div className="text-3xl font-bold mb-6">Submission history</div> */}
      <Card className="p-6 h-[875px] overflow-auto relative">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-semibold">Submission History</CardTitle>
        </CardHeader>
        {/* Filter/Search Bar */}
        <div className="flex justify-end items-center mb-4 gap-3">
          <div className="relative w-64">
            <Input
              className="pl-10 pr-4 bg-[#f7f9fa] border rounded-full"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
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
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <Table className="">
            <TableHeader>
              <TableRow isHeader className="bg-[#3881A2] text-white">
                <TableHead className="text-white font-semibold text-base text-center w-[5%]">No</TableHead>
                <TableHead className="text-white font-semibold text-base w-[35%]">Name</TableHead>
                <TableHead className="text-white font-semibold text-base text-center w-[20%]">Date</TableHead>
                <TableHead className="text-white font-semibold text-base text-center w-[20%]">Scoring System</TableHead>
                <TableHead className="text-white font-semibold text-base text-center w-[20%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.map((row, idx) => (
                <TableRow key={row.id} className={idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}>
                  <TableCell className="text-center">{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-center">{row.date}</TableCell>
                  <TableCell className="text-center">{row.scoringSystem}</TableCell>
                  <TableCell className="flex justify-center gap-2 items-center">
                    <Button size="icon" variant="ghost" title="Download">
                      <DownloadIcon className="w-5 h-5 text-[#3881A2]" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Open">
                      <Icons.ShareIcon className="w-5 h-5 text-[#3881A2]" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Delete">
                      <Icons.XIcon className="w-5 h-5 text-[#E57373]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="absolute bottom-8 right-10 flex justify-end items-center gap-2">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  page === i + 1 ? "bg-[#3881A2] text-white" : "bg-white text-[#3881A2]"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
      </Card>
    </div>
  );
}
