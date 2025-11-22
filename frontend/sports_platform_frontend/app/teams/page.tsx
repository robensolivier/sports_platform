"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for teams
const teams = [
  { id: 1, name: "The Champions", sport: "Soccer", members: 11 },
  { id: 2, name: "The Eagles", sport: "Basketball", members: 5 },
  { id: 3, name: "The Titans", sport: "Football", members: 11 },
  { id: 4, name: "The Warriors", sport: "Soccer", members: 11 },
];

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for a team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Members</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.sport}</TableCell>
              <TableCell>{team.members}</TableCell>
              <TableCell>
                <Link href={`/teams/${team.id}`}>
                  <p className="text-blue-500 hover:underline">View</p>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
