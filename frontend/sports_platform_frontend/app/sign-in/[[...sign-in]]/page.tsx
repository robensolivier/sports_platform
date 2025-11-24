"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch("/api/accounts/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: user.id }),
      });
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}
