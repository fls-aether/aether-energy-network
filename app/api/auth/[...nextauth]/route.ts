import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Environment Variable Fallback: Check to ensure NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not accidentally bundled into server-side-only secrets
if (
  process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY && 
  (process.env.GOOGLE_CLIENT_SECRET === process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || 
   process.env.NEXTAUTH_SECRET === process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)
) {
  console.error("CRITICAL CONFIG ERROR: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is bundled into NextAuth server secrets!");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/', // Forces NextAuth to use your home/splash/intake page instead of the red/white button page
    error: '/',  // Redirects back home on error so we can see the UI
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  // @ts-ignore - trustHost is often used by newer Auth.js/NextAuth to bypass specific Vercel host checks
  trustHost: true,
});

export { handler as GET, handler as POST };
