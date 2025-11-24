"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import tournamentService from "@/app/services/tournamentService";
import requestService from "@/app/services/requestService";




// Type pour les requêtes
interface JoinRequest {
  id: number;
  player: number;
  team: number;
  created_at: string;
  status?: string;
}

export default function RequestsPage() {
  const { getJoinRequests, acceptJoinRequest, rejectJoinRequest } = requestService();

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les requêtes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJoinRequests();
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
        setError("Erreur lors du chargement des requêtes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Accepter une requête
  const handleAccept = async (requestId: number) => {
    try {
      await acceptJoinRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("Failed to accept request", err);
      setError("Erreur lors de l'acceptation de la requête");
    }
  };

  // Refuser une requête
  const handleReject = async (requestId: number) => {
    try {
      await rejectJoinRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("Failed to reject request", err);
      setError("Erreur lors du rejet de la requête");
    }
  };

  // UI Loading
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <p>Chargement des requêtes...</p>
        </div>
      </div>
    );
  }

  // UI Error
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // UI Principal
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gérer les Requêtes</h1>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune requête de jointure pour le moment.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Joueur (ID)</TableHead>
              <TableHead>Équipe (ID)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.player}</TableCell>
                <TableCell>{request.team}</TableCell>
                <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accepter
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                  >
                    Refuser
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}