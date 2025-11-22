"use client";

import { useState } from "react";
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

// Mock data for matches
const matches = [
  { id: 1, teamA: "The Champions", teamB: "The Warriors", score: "3-2", date: "2024-07-05" },
  { id: 2, teamA: "The Eagles", teamB: "The Titans", score: "101-98", date: "2024-08-15" },
];

export default function MatchesPage() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  // For now, we'll assume a user is an organizer if their username is 'organizer'
  const isOrganizer = user?.username === 'organizer';

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
                <Button type="submit" onClick={() => setOpen(false)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team A</TableHead>
            <TableHead>Team B</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.teamA}</TableCell>
              <TableCell>{match.teamB}</TableCell>
              <TableCell>{match.score}</TableCell>
              <TableCell>{match.date}</TableCell>
              <TableCell>
                <Link href={`/matches/${match.id}`}>
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
