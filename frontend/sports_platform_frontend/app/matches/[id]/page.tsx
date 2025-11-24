"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  location?: string | null;
  tournament?: string | null;
};

export default function MatchDetailPage() {
  const params = useParams();
  const matchId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/matches/${matchId}/`
        );
        if (!res.ok) throw new Error("Erreur lors de la récupération du match");
        const data = await res.json();
        setMatch(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  if (loading) {
    return <div className="container mx-auto p-4">Chargement du match...</div>;
  }
  if (error || !match) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Erreur : {error || "Aucun match trouvé."}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {match.team_a?.name} vs {match.team_b?.name}
          </CardTitle>
          <CardDescription>
            {match.tournament ?? "Tournoi inconnu"} -{" "}
            {new Date(match.date).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center text-4xl font-bold">
            <p>
              {match.score_a} - {match.score_b}
            </p>
          </div>
          <p>
            Lieu : {match.location ?? "-"}
            <br />
            Match ID : {match.id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
