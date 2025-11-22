"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for a match
const match = {
  id: 1,
  teamA: "The Champions",
  teamB: "The Warriors",
  score: "3-2",
  date: "2024-07-05",
  tournament: "Summer Soccer Fest",
};

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the match data based on the id
  // For now, we use the mock data
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {match.teamA} vs {match.teamB}
          </CardTitle>
          <CardDescription>
            {match.tournament} - {match.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center text-4xl font-bold">
            <p>{match.score}</p>
          </div>
        </CardContent>
        <CardFooter>
          <p>Match ID: {params.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
