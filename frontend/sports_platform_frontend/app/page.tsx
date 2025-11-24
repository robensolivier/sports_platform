"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useApi from "./hooks/useApi";

interface Tournament {
  id: number;
  name: string;
  // Add other fields as per your Tournament model
}

export default function Home() {
  const api = useApi();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tournaments/");
        setTournaments(response.data);
      } catch (err) {
        setError("Failed to fetch tournaments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [api]);

  // Fonction unique pour récupérer le statut d'inscription
  const fetchRegistrationStatus = async () => {
    if (isSignedIn && user?.id) {
      try {
        const res = await fetch(
          "http://localhost:8000/api/accounts/auth/login/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clerk_id: user.id }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          setIsRegistered(data.user?.is_registered ?? false);
        } else {
          setIsRegistered(false);
        }
      } catch {
        setIsRegistered(false);
      }
    } else {
      setIsRegistered(null);
    }
  };

  useEffect(() => {
    fetchRegistrationStatus();
  }, [isSignedIn, user]);

  // Rafraîchit le statut si signalé par localStorage (après inscription)
  useEffect(() => {
    const refreshStatus = () => {
      if (window.localStorage.getItem("refreshRegistrationStatus") === "1") {
        fetchRegistrationStatus();
        window.localStorage.removeItem("refreshRegistrationStatus");
      }
    };
    window.addEventListener("focus", refreshStatus);
    refreshStatus();
    return () => {
      window.removeEventListener("focus", refreshStatus);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRegistrationStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSignedIn, user]);

  const showButtons = isSignedIn && isRegistered === true;

  return (
    <main className="flex-grow">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
          Bienvenue sur Sports Platform
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Organisez et suivez vos tournois sportifs préférés en toute
          simplicité.
        </p>
        {showButtons && (
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/tournaments">
              <Button size="lg"> Tournois</Button>
            </Link>
            <Link href="/players">
              <Button size="lg" variant="outline">
                Joueur
              </Button>
            </Link>
          </div>
        )}
        {isSignedIn && isRegistered === false && (
          <div className="mt-10 flex flex-col items-center">
            <div className="text-lg text-blue-700 dark:text-blue-300 font-semibold mb-4">
              Inscrivez-vous pour en savoir plus sur la plateforme !
            </div>
            <Link href="/account-signup">
              <Button size="lg" variant="default">
                Inscription
              </Button>
            </Link>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Upcoming Tournaments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <p className="text-center w-full col-span-full">
              Loading tournaments...
            </p>
          )}
          {error && (
            <p className="text-center w-full col-span-full text-red-500">
              {error}
            </p>
          )}
          {!loading && !error && tournaments.length === 0 && (
            <p className="text-center w-full col-span-full">
              Aucun Tournois Trouvé.
            </p>
          )}
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {tournament.name}
              </h3>
              {/* Add more tournament details here */}
              <Link href={`/tournaments/${tournament.id}`}>
                <Button variant="outline" className="mt-4">
                  Voir Détails
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
