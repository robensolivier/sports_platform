"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import playerService from "../services/playerService"; // Adjust the import path as necessary

type Player = {
  id: string;
  full_name: string;
  favorite_sport: string;
  level: string;
  city: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const { getPlayerProfiles } = playerService();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayerProfiles();
        setPlayers(data);
      } catch (error: any) { // Catch any error type
        console.error("Failed to fetch players:", error);
        setError(error.message || "Failed to load players."); // Set user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading players...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Sport Préféré</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Ville</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.full_name}</TableCell>
              <TableCell>{player.favorite_sport}</TableCell>
              <TableCell>{player.level}</TableCell>
              <TableCell>{player.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
