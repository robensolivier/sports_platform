"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { useUser } from "@clerk/nextjs";
import matchService from "../services/matchService"; // Adjust the import path as necessary

export default function MatchesPage() {
  type Team = {
    name: string;
  };

  type Match = {
    id: string;
    team_a?: Team | null;
    team_b?: Team | null;
    score_a?: number | null;
    score_b?: number | null;
    date: string;
  };

  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const { getMatches } = matchService();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Appel à l'API filtrée par joueur
        const res = await fetch(`/api/matches?player_id=${user?.id}`);
        const data = await res.json();
        setMatches(data);
      } catch (error: any) {
        // Catch any error type
        console.error("Failed to fetch matches:", error);
        setError(error.message || "Failed to load matches."); // Set user-friendly error message
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMatches();
  }, [user]);

  // For now, we'll assume a user is an organizer if their username is 'organizer'
  const isOrganizer = user?.username === "organizer";

  if (loading) {
    return <div className="container mx-auto p-4">Loading matches...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Matches</h1>
        {isOrganizer && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Créer Match</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau match</DialogTitle>
                <DialogDescription>
                  Remplissez les détails ci-dessous pour créer un nouveau match.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teamA" className="text-right">
                    Équipe A
                  </Label>
                  <Input id="teamA" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teamB" className="text-right">
                    Équipe B
                  </Label>
                  <Input id="teamB" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="score" className="text-right">
                    Score
                  </Label>
                  <Input id="score" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setOpen(false)}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Équipe A</TableHead>
            <TableHead>Équipe B</TableHead>
            <TableHead>Résultat</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.team_a?.name}</TableCell>
              <TableCell>{match.team_b?.name}</TableCell>
              <TableCell>
                {match.score_a} - {match.score_b}
              </TableCell>
              <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Link href={`/matches/${match.id}`}>
                  <p className="text-blue-500 hover:underline">Voir</p>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
