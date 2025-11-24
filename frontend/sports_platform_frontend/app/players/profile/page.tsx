"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dummy data for player profile
const dummyPlayerProfile = {
  fullName: "John Doe",
  city: "New York",
  mainSport: "Basketball",
  level: "Intermediate",
  preferredPosition: "Point Guard",
};

export default function PlayerProfilePage() {
  const [profile, setProfile] = useState(dummyPlayerProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    alert("Profile saved! (Check the console)");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>Mettez à jour vos informations de profil ici.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" value={profile.fullName} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" value={profile.city} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mainSport">Sport principal</Label>
            <Input id="mainSport" value={profile.mainSport} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level">Niveau (débutant/intermédiaire/avancé)</Label>
            <Input id="level" value={profile.level} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferredPosition">Poste préféré (optionnel)</Label>
            <Input id="preferredPosition" value={profile.preferredPosition} onChange={handleInputChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
