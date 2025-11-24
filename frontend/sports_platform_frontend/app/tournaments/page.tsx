"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import tournamentService from "@/app/services/tournamentService";
import useApi from "@/app/hooks/useApi";

type Tournament = {
  id: string;
  name: string;
  sport: string;
  start_date: string;
  city: string;
  // Add other fields from your backend Tournament model as needed
};

export default function TournamentsPage() {
  const [open, setOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const api = useApi(); // Initialize api
  const { getTournaments } = tournamentService(api); // Pass api to tournamentService

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (error: any) {
        // Catch any error type
        console.error("Failed to fetch tournaments:", error);
        setError(error.message || "Failed to load tournaments."); // Set user-friendly error message
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading tournaments...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Les Tournois</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>{tournament.sport}</TableCell>
              <TableCell>{tournament.start_date}</TableCell>
              <TableCell>{tournament.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
