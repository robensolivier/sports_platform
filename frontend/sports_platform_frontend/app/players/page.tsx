"use client";

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

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const api = useApi();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get("/players/");
        setPlayers(response.data);
      } catch (error) {
        console.error("Failed to fetch players", error);
      }
    };

    fetchPlayers();
  }, [api]);

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
