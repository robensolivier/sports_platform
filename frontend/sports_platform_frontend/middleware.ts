import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Tes routes publiques (pas protégées)
    "/",
    "/teams/:path*",
    "/players/:path*",
    "/matches/:path*",

    // Clerks internals à EXCLURE
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

