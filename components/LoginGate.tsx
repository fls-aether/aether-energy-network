"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface LoginGateProps {
  onComplete: () => void;
}

export function LoginGate({ onComplete }: LoginGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const handleGuest = () => {
    onComplete();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Email login logic stub
    setIsAuthenticating(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full p-8 md:p-16 z-20 flex flex-col items-center justify-center max-w-md"
      >
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image 
              src="/images/aether-network-logo3.png" 
              alt="Aether Network Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-neon-gold uppercase mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Network Access
          </h1>
          <p className="text-foreground/70 tracking-widest text-xs uppercase">
            Identify to connect //
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label htmlFor="authEmail" className="block text-xs font-mono text-neon-purple uppercase tracking-widest">
              Email Vector
            </label>
            <input
              id="authEmail"
              name="authEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel border-b-2 border-neon-purple/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-purple transition-colors"
              placeholder="user@origin.net"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="authPassword" className="block text-xs font-mono text-neon-amber uppercase tracking-widest">
              Passcode
            </label>
            <input
              id="authPassword"
              name="authPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel border-b-2 border-neon-amber/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-amber transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-4 mt-4 bg-transparent border border-neon-gold text-neon-gold font-bold tracking-[0.2em] uppercase hover:bg-neon-gold/10 transition-colors relative overflow-hidden group"
          >
            <span className="relative z-10">{isAuthenticating ? "Verifying..." : "Establish Link"}</span>
          </motion.button>
        </form>

        <div className="flex items-center gap-4 my-8 w-full">
           <div className="h-px bg-white/10 flex-1"></div>
           <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.3em]">External Auth</span>
           <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleAuth}
          disabled={isAuthenticating}
          className="w-full py-3 mb-4 bg-black/40 border border-white/20 text-white font-mono text-sm tracking-widest hover:border-neon-gold hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group rounded"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          <span className="relative z-10 group-hover:text-neon-gold transition-colors">
            {isAuthenticating ? "Authenticating..." : "Sign in with Google"}
          </span>
        </motion.button>

        <button 
          onClick={handleGuest}
          className="text-white/50 hover:text-white mt-4 font-mono text-[10px] uppercase tracking-widest transition-colors"
        >
          [ Continue as Guest ]
        </button>

      </motion.div>
    </div>
  );
}
