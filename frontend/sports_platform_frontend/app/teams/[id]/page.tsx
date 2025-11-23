"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for a team
const team = {
  id: 1,
  name: "The Champions",
  sport: "Soccer",
  members: [
    { id: 1, name: "John Doe", avatarUrl: "https://github.com/shadcn.png" },
    { id: 2, name: "Jane Doe", avatarUrl: "https://github.com/shadcn.png" },
    { id: 3, name: "Peter Jones", avatarUrl: "https://github.com/shadcn.png" },
  ],
};

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleJoinRequest = () => {
    // In a real application, you would send a join request to the backend
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
  };

  // In a real application, you would fetch the team data based on the id
  // For now, we use the mock data
  return (
    <div className="container mx-auto p-4">
      {showConfirmation && (
        <Alert className="mb-4">
          <AlertTitle>Request envoyé!</AlertTitle>
          <AlertDescription>
            Votre demande pour joindre  {team.name} a été envoyé.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>Sport: {team.sport}</CardDescription>
            </div>
            <Button onClick={handleJoinRequest}>Rejoindre Équipe</Button>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold">Players</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {team.members.map((player) => (
              <div key={player.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={player.avatarUrl} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p>{player.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p>Équipe ID: {params.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
