"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for join requests
const requests = [
  { id: 1, playerName: "Alice", teamName: "The Champions", date: "2024-06-15" },
  { id: 2, name: "Bob", teamName: "The Eagles", date: "2024-06-16" },
];

export default function RequestsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gérer les Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur</TableHead>
            <TableHead>Équipe</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.playerName}</TableCell>
              <TableCell>{request.teamName}</TableCell>
              <TableCell>{request.date}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Accepter</Button>
                <Button variant="destructive" size="sm">Refuser</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
