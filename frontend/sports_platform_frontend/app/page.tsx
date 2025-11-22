import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="flex-grow">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
          Bienvenue sur Sports Platform
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
         Organisez et suivez vos tournois sportifs préférés en toute simplicité.
        </p>
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
      </section>
    </main>
  );
}
