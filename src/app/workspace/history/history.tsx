import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DownloadIcon,
  Share2Icon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";

interface Submission {
  id: number;
  name: string;
  scoringSystem: string;
  date: string;
}

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call later
  const submissions: Submission[] = [
    {
      id: 1,
      name: "Kì thi ngày 30/4",
      scoringSystem: "Aptis",
      date: "2025-02-01",
    },
    // Add more mock data as needed
  ];

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Submission History</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Scoring System</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission, index) => (
            <TableRow key={submission.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{submission.name}</TableCell>
              <TableCell>{submission.scoringSystem}</TableCell>
              <TableCell>{format(new Date(submission.date), "dd/MM/yyyy")}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" title="Download">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Share">
                  <Share2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Edit">
                  <Pencil1Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Delete">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
