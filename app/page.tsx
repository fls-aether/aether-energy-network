"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntakeManifold } from "@/components/IntakeManifold";
import { DiagnosticWeld } from "@/components/DiagnosticWeld";
import { SovereignDashboard } from "@/components/SovereignDashboard";
import Image from "next/image";
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
            className="flex flex-col items-center justify-center min-h-screen absolute inset-0 z-50 bg-background"
          >
            <button 
               onClick={() => setPhase("INTAKE")}
               className="relative flex flex-col items-center justify-center group cursor-pointer outline-none mt-12 focus:ring-2 focus:ring-neon-gold focus:ring-offset-4 focus:ring-offset-background p-4 rounded-xl"
            >
              {/* High-Fidelity Asset Container */}
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center z-10 transition-transform duration-700 group-hover:scale-105">
                {/* Inner Geometry (Pulse) */}
                <motion.div
                  className="absolute inset-0 z-10"
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                >
                  <Image 
                    src="/images/aether-network-logo-inner-geometry.png"
                    alt="Aether Network Geometry"
                    fill
                    className="object-contain scale-90 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] transition-all duration-700"
                    priority
                  />
                </motion.div>

                {/* Outer Ouroboros (Spin) */}
                <motion.div
                  className="absolute inset-0 z-20"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                >
                  <Image 
                    src="/images/aether-network-logo-outer-ouroboros.png"
                    alt="Aether Network Ouroboros"
                    fill
                    className="object-contain scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] transition-all duration-700"
                    priority
                  />
                </motion.div>
              </div>
              
              {/* Typography & Alignment Line */}
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 z-50 w-full max-w-md">
                <div className="w-[1px] h-16 bg-gradient-to-t from-[#D4AF37]/90 to-transparent group-hover:from-neon-gold transition-colors duration-700" />
                <span className="text-neon-gold/80 tracking-[0.3em] font-light text-sm md:text-base group-hover:text-neon-gold transition-colors duration-700 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] whitespace-nowrap">
                  TOUCH TO INITIALIZE GRID
                </span>
              </div>

              {/* Ambient Backglow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-neon-gold/5 rounded-full blur-[100px] animate-pulse group-hover:bg-neon-gold/15 transition-colors duration-700 pointer-events-none" />
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
