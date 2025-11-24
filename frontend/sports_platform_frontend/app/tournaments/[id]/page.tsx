"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useApi from "@/app/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  start_date: string;
  city: string;
  // Ajoute d'autres champs si nécessaire
}

export default function TournamentDetailPage() {
  const { id } = useParams();
  const api = useApi();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tournaments/${id}/`);
        setTournament(response.data);
      } catch (err) {
        setError("Impossible de charger le tournoi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTournament();
  }, [id, api]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">Chargement du tournoi...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Erreur : {error}</div>
    );
  }

  if (!tournament) {
    return <div className="container mx-auto p-4">Tournoi introuvable.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Détail du tournoi</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Ville</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{tournament.name}</TableCell>
            <TableCell>{tournament.sport}</TableCell>
            <TableCell>{tournament.start_date}</TableCell>
            <TableCell>{tournament.city}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
