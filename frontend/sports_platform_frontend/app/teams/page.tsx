"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import teamService from "../services/teamService"; // Assurez-vous que le chemin est correct

type Team = {
  id: string;
  name: string;
  sport: string;
  members_count: number;
};

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSportValue, setNewTeamSportValue] = useState("");

  const { getTeams, createTeam } = teamService();

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err: any) {
      console.error("Failed to fetch teams:", err);
      setError(err.message || "Impossible de charger les équipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newTeamSportValue.trim()) {
      setError("Le nom et le sport sont obligatoires.");
      return;
    }

    try {
      await createTeam({
        name: newTeamName,
        sport: newTeamSportValue,
      });
      setOpen(false);
      setNewTeamName("");
      setNewTeamSportValue("");
      await fetchTeams();
    } catch (err: any) {
      console.error("Failed to create team:", err);
      setError(err.message || "Impossible de créer l'équipe.");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Chargement des équipes...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gérer les équipes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Créer Équipe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle équipe</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour créer une nouvelle équipe.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input
                  id="name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sport" className="text-right">Sport</Label>
                <Input
                  id="sport"
                  value={newTeamSportValue}
                  onChange={(e) => setNewTeamSportValue(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTeam}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher une équipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Membres</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.sport}</TableCell>
              <TableCell>{team.members_count}</TableCell>
              <TableCell>
                <Link href={`/teams/${team.id}`}>
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