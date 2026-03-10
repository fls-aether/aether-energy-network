"use client";

import { useState, useEffect } from "react";
import { CharacterStatSheet, CharacterStat } from "@/components/adventure/CharacterStatSheet";
import { NarrativeCodex, CodexEntry } from "@/components/adventure/NarrativeCodex";
import { CharacterGallery } from "@/components/adventure/CharacterGallery";
import { MaturityLockedView } from "@/components/adventure/MaturityLockedView";
import { motion } from "framer-motion";
import { useOperatorStore } from "@/lib/store";
import { OPERATOR_IDENTITY } from "@/lib/identityPayload";

export default function AdventurePortal() {
  const { isAdult, stats: storeStats } = useOperatorStore();
  const [stats, setStats] = useState<CharacterStat[] | null>(null);
  const [logs, setLogs] = useState<CodexEntry[] | null>(null);

  // Setup live stats on mount if they exist in the store
  useEffect(() => {
    if (storeStats) {
       setStats([
          { id: "logic", label: "Logic", value: storeStats.logic, colorClass: "text-neon-gold", strokeColor: "#ffd700" },
          { id: "drive", label: "Drive", value: storeStats.drive, colorClass: "text-neon-purple", strokeColor: "#9d00ff" },
          { id: "empathy", label: "Empathy", value: storeStats.empathy, colorClass: "text-neon-green", strokeColor: "#00ffaa" },
          { id: "stability", label: "Stability", value: storeStats.stability, colorClass: "text-neon-amber", strokeColor: "#ffaa00" },
       ]);
    }
  }, [storeStats]);

  // Hydration Pipeline - Phase 25 Live AI Integraton (Logs)
  useEffect(() => {
    const fetchAdventureData = async () => {
      try {
         const res = await fetch('/api/aether', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
               stats: storeStats,
               hardware: OPERATOR_IDENTITY.astrological.Draconic,
               source: "story"
            }),
         });
         const data = await res.json();
         // Initialize as an array with the single Log object returned
         setLogs([data.adventureLog]);
      } catch (error) {
         console.error("Failed to hydrate adventure logs:", error);
         setLogs([{
            id: `error-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            text: "[Local Error] Failed to connect to Oracle Relay."
         }]);
      }
    };

    if (storeStats) {
       fetchAdventureData();
    }
  }, [storeStats]);

  return (
    <div className="min-h-screen w-full bg-background pt-12 pb-40 px-4 md:px-8 relative overflow-hidden flex justify-center">
       {/* Ambient Backing layered to match LitRPG aesthetic */}
      <div className="absolute top-0 right-1/3 w-full h-1 bg-gradient-to-l from-neon-gold/20 via-neon-purple/10 to-transparent blur-[2px]" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-4xl relative z-10 flex flex-col space-y-8">
        
        {/* Header Array */}
        <motion.header 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="border-b border-white/10 pb-4 flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-[0.2em] text-neon-purple uppercase drop-shadow-[0_0_8px_rgba(188,19,254,0.4)]">
              Adventure Portal
            </h1>
            <p className="text-foreground/60 text-xs font-mono tracking-widest uppercase mt-1">
              Active Quest Log // Telemetry Engine
            </p>
          </div>
        </motion.header>

        {/* Biometric Stats */}
        <motion.section 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
        >
            <CharacterStatSheet stats={stats} />
        </motion.section>

        {/* Quest Log / Narrative */}
        <motion.section 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
        >
            <NarrativeCodex logs={logs} />
        </motion.section>

        {/* Maturity Gated Character Gallery */}
        <motion.section
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
        >
            {isAdult ? <CharacterGallery /> : <MaturityLockedView />}
        </motion.section>

      </main>
    </div>
  );
}
