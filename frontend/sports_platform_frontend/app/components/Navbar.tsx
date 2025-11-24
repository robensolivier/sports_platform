"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRegistrationStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Ajout du listener pour l'événement personnalisé
    const handleUserRegistered = () => {
      fetchRegistrationStatus();
    };
    window.addEventListener("userRegistered", handleUserRegistered);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("userRegistered", handleUserRegistered);
    };
  }, [isSignedIn, user]);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          Sports Platform
        </Link>
        {isSignedIn && isRegistered === false && (
          <Link href="/account-signup">Inscription</Link>
        )}
        {isSignedIn && isRegistered === true && (
          <>
            <Link href="/matches" className="hover:text-gray-300">
              Matches
            </Link>
            <Link href="/teams" className="hover:text-gray-300">
              Équipes
            </Link>
            <Link href="/players" className="hover:text-gray-300">
              Joueurs
            </Link>
            <Link href="/dashboard/teams" className="hover:text-gray-300">
              Mes Équipes
            </Link>
            <Link href="/requests" className="hover:text-gray-300">
              Demandes d'adhésion
            </Link>
          </>
        )}
      </div>
      <div>
        {isLoaded && isSignedIn && <UserButton afterSignOutUrl="/" />}
        {isLoaded && !isSignedIn && (
          <Link href="/sign-in" className="hover:text-gray-300">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
