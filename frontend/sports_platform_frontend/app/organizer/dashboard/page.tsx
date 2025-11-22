"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data for organizer dashboard
const quickStats = {
  tournamentsCreated: 5,
  totalTeams: 48,
  pendingRequests: 12,
};

const dummyTournaments = [
  { id: 1, name: "Summer Soccer Fest", status: "Ongoing" },
  { id: 2, name: "Basketball Mania", status: "Upcoming" },
  { id: 3, name: "Tennis Open", status: "Finished" },
];

export default function OrganizerDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord de l'organisateur</h1>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tournois Créés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{quickStats.tournamentsCreated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Équipes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{quickStats.totalTeams}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demandes en Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{quickStats.pendingRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tournaments List */}
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
              {dummyTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>{tournament.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">Gérer</Button>
                    <Button variant="destructive" size="sm">Annuler</Button>
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
