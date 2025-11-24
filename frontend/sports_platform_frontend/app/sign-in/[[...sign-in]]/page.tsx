"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch("/accounts/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: user.id }),
      }).then((res) => {
        if (res.ok) {
          router.push("/"); // Redirige vers l'accueil si l'id Clerk est dans la BDD
        } else {
          router.push("/account-signup"); // Redirige vers la page d'inscription sinon
        }
      });
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}
