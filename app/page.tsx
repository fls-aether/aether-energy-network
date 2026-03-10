"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntakeManifold } from "@/components/IntakeManifold";
import { DiagnosticWeld } from "@/components/DiagnosticWeld";
import { SovereignDashboard } from "@/components/SovereignDashboard";
import { OuroborosMerkabah } from "@/components/OuroborosMerkabah";
import { useOperatorStore } from "@/lib/store";

type AppPhase = "SPLASH" | "INTAKE" | "DIAGNOSTIC" | "SOVEREIGN";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("SPLASH");
  const { isRegistered, setRegistered } = useOperatorStore();
  const [hasMounted, setHasMounted] = useState(false);

  // Hydration safety: ensure we only read persisted store on the client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    // Instant bypass if already registered
    if (isRegistered && phase === "SPLASH") {
        setPhase("SOVEREIGN");
        return;
    }

    // Trigger global navigation access once Sovereign mode starts
    if (phase === "SOVEREIGN" && !isRegistered) {
      setRegistered(true);
    }
  }, [phase, isRegistered, setRegistered, hasMounted]);

  // Prevent hydration mismatch flashes
  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-background text-foreground font-mono overflow-hidden pb-40">
      <AnimatePresence mode="wait">
        
        {/* BOOT / SPLASH SCREEN */}
        {phase === "SPLASH" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen space-y-8 absolute inset-0 z-50 bg-background"
          >
            <button 
               onClick={() => setPhase("INTAKE")}
               className="relative w-64 h-64 flex items-center justify-center group cursor-pointer outline-none focus:ring-2 focus:ring-neon-gold focus:ring-offset-4 focus:ring-offset-background rounded-full transition-transform duration-700 hover:scale-105"
            >
              <OuroborosMerkabah />
              <div className="absolute inset-0 bg-neon-gold/10 rounded-full blur-[80px] animate-pulse group-hover:bg-neon-gold/30 transition-colors duration-700" />
            </button>
          </motion.div>
        )}

        {/* PHASE 1: INTAKE MANIFOLD */}
        {phase === "INTAKE" && (
          <motion.div
            key="intake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <IntakeManifold onComplete={() => setPhase("DIAGNOSTIC")} />
          </motion.div>
        )}

        {/* PHASE 2: DIAGNOSTIC WELD */}
        {phase === "DIAGNOSTIC" && (
          <motion.div
            key="diagnostic"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <DiagnosticWeld onComplete={() => setPhase("SOVEREIGN")} />
          </motion.div>
        )}

        {/* PHASE 3: SOVEREIGN DASHBOARD */}
        {phase === "SOVEREIGN" && (
          <motion.div
            key="sovereign"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <SovereignDashboard />
          </motion.div>
        )}
        
      </AnimatePresence>
    </main>
  );
}
