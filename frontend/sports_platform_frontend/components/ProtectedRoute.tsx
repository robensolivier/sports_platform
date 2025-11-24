import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant de protection de route selon le rôle utilisateur
 * @param allowedRoles tableau des rôles autorisés (ex: ["player"])
 * @param user objet utilisateur (doit contenir la propriété 'role')
 * @param children contenu à afficher si autorisé
 */
export default function ProtectedRoute({ allowedRoles, user, children }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/"); // ou une page d'erreur
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // ou un loader
  }

  return children;
}
