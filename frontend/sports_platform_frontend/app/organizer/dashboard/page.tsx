"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useApi from "@/app/hooks/useApi";
import tournamentService from "@/app/services/tournamentService";


// Type pour les tournois
type Tournament = {
  id: string | number;
  name: string;
  start_date: string;
};

export default function OrganizerDashboardPage() {
  const api = useApi(); // Hook React ici
  const { getOrganizerTournaments } = tournamentService(api); // Service pur

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getOrganizerTournaments();
        setTournaments(data);
      } catch (err: any) {
        console.error("Failed to fetch organizer tournaments:", err);
        setError(err.message || "Impossible de charger les tournois.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [getOrganizerTournaments]);

  const getTournamentStatus = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    return start > today ? "Upcoming" : "Ongoing";
  };

  if (loading) {
    return <div className="container mx-auto p-4">Chargement des tournois...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord de l'organisateur</h1>

      <h2 className="text-2xl font-bold mb-4">Mes Tournois</h2>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Tournoi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>{getTournamentStatus(tournament.start_date)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Gérer
                    </Button>
                    <Button variant="destructive" size="sm">
                      Annuler
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}