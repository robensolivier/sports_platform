"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          Sports Platform
        </Link>
        <Link href="/matches" className="hover:text-gray-300">
          Matches
        </Link>
        <Link href="/teams" className="hover:text-gray-300">
          Équipes
        </Link>
        <Link href="/players" className="hover:text-gray-300">
          Joueurs
        </Link>
        {isSignedIn && (
          <Link href="/dashboard/teams" className="hover:text-gray-300">
            Mes Équipes
          </Link>
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
