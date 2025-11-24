"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RegisterAccountPage() {
  const { user } = useUser();
  const clerkId = user?.id || "";

  const [email, setEmail] = useState(
    user?.emailAddresses[0]?.emailAddress || ""
  );
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [role, setRole] = useState("player");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/accounts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          role,
          clerk_id: clerkId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Inscription réussie !");
      } else {
        setMessage(data.detail || "Erreur lors de l'inscription.");
      }
    } catch {
      setMessage("Erreur réseau.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!user}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Nom complet</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={!!user}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Rôle</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="player">Joueur</option>
            <option value="organizer">Organisateur</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
        {message && (
          <div className="mt-2 text-center text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
}
