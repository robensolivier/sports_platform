"use client";

import { useState, useEffect } from "react";
import { teamService } from "@/app/services/teamService";
import useApi from "@/app/hooks/useApi";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function JoinRequestPage() {
  const api = useApi();
  const { user } = useUser();
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  // Récupère les équipes depuis le backend au chargement
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const service = teamService(api);
        const data = await service.getTeams();
        setTeams(data);
      } catch (err) {
        setError("Erreur lors du chargement des équipes.");
        // Log error details for debugging
        console.error("Team fetch error:", err);
      }
    };
    fetchTeams();
  }, [api]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Appel backend pour créer la demande d'adhésion
      await api.post("/api/join-requests/", {
        team: teamId,
        message,
        player_id: user?.id,
      });
      setSuccess("Demande envoyée avec succès !");
      setTeamId("");
      setMessage("");
    } catch (err: any) {
      setError("Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">
        Demande d'adhésion à une équipe
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nom de l'équipe *</label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>
              Choisir une équipe
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Message (optionnel)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Votre message..."
            rows={3}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer la demande"}
        </Button>
        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
