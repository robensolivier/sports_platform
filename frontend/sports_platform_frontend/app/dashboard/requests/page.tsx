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
import useApi from "@/app/hooks/useApi";
import { useEffect, useState } from "react";

// Mock data for join requests
// const requests = [
//   { id: 1, playerName: "Alice", teamName: "The Champions", date: "2024-06-15" },
//   { id: 2, name: "Bob", teamName: "The Eagles", date: "2024-06-16" },
// ];

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const api = useApi();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/api/join-requests/");
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
    };

    fetchRequests();
  }, [api]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gérer les Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur (ID)</TableHead>
            <TableHead>Équipe (ID)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              {/*
                Displaying player and team IDs as the backend API does not provide
                an efficient way to fetch player and team names in a list view.
                Modifying the backend is required to display names instead of IDs.
              */}
              <TableCell>{request.player}</TableCell>
              <TableCell>{request.team}</TableCell>
              <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
