"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const useApi = () => {
  return {
    get: async (path: string) => {
      // Simple client-side wrapper around fetch; adjust base URL as needed.
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json().catch(() => null);
      return { data };
    },
    post: async (path: string, body: any) => {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json().catch(() => null);
      return { data };
    },
  };
};

// Mock player data structure
interface Player {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    winRate: string;
  };
  team: {
    id: number;
    name: string;
  };
}

export default function PlayerDetailPage({ params }: { params: { id: string } }) {
  const api = useApi();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        // This is a mock API call. Replace with your actual API endpoint.
        // const response = await api.get(`/players/${params.id}`);
        // setPlayer(response.data);

        // Mocking the API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlayer({
          id: parseInt(params.id),
          name: "John Doe",
          username: "johndoe",
          email: "john.doe@example.com",
          avatarUrl: "https://github.com/shadcn.png",
          stats: {
            matchesPlayed: 120,
            wins: 80,
            losses: 40,
            winRate: "66.67%",
          },
          team: {
            id: 1,
            name: "The Champions",
          },
        });
      } catch (err) {
        setError("Failed to load player data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [api, params.id]);

  if (loading) {
    return <div>Téléchargement..</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!player) {
    return <div>Joueur Introuvable.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={player.avatarUrl} alt={player.name} />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{player.name}</CardTitle>
              <CardDescription>@{player.username}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Team</h3>
              <p>{player.team.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{player.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Statistics</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p>Matches Joué: {player.stats.matchesPlayed}</p>
              <p>Victoires: {player.stats.wins}</p>
              <p>Défaites: {player.stats.losses}</p>
              <p>Taux de victoire: {player.stats.winRate}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p>Joueur ID: {params.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
