"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SystemIntegrityMeter } from "./SystemIntegrityMeter";
import { FrictionAlertBanner } from "./FrictionAlertBanner";
import { KineticStatSheet } from "./KineticStatSheet";
import { GroundingGeometryCanvas } from "./GroundingGeometryCanvas";
import { WireframeMerkaba } from "./WireframeMerkaba";
import { useState, useEffect } from "react";
import { useOperatorStore, TelemetryPayload } from "@/lib/store";
import { Canvas } from "@react-three/fiber";
import { getGroundingScent } from "@/lib/scentMappings";

function formatLunarDate(isoString: string) {
  if (!isoString) return "";
  try {
     return new Date(isoString).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) {
     return isoString;
  }
}

export function SovereignDashboard() {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const { operatorDetails, telemetry, setGlobalTelemetry, telemetryLastUpdated, setTelemetryLastUpdated } = useOperatorStore();
  const tropicalSunSign = telemetry?.identitiesMatrix?.tropical?.find((p) => p.celestialBody === "Sun")?.sign;

  useEffect(() => {
    // Cache invalidation fallback for Target Alpha upgrade
    if (telemetry && !telemetry.identitiesMatrix) {
       console.warn("Outdated Telemetry Schema Detected: Cleared for hydration.");
       setGlobalTelemetry(null as unknown as TelemetryPayload);
    }
  }, [telemetry, setGlobalTelemetry]);

  useEffect(() => {
    async function fetchForecast() {
      if (!operatorDetails) return;

      const today = new Date().toLocaleDateString();
      if (telemetry && telemetryLastUpdated) {
        const lastUpdatedDate = new Date(telemetryLastUpdated).toLocaleDateString();
        if (lastUpdatedDate === today) {
          return; // Bypass API fetch
        }
      }

      try {
        const res = await fetch("/api/forecast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operatorDetails
          }),
        });
        const data = await res.json();
        if (!res.ok) {
           throw new Error(data.error || "Aether Grid Offline: Schema Mapping Failed");
        }
        setGlobalTelemetry(data);
        setTelemetryLastUpdated(Date.now());
      } catch (e: any) {
        console.error("Forecast hydration failed:", e);
        setForecastError(e.message || "Aether Grid Offline: Schema Mapping Failed");
      }
    }
    fetchForecast();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operatorDetails]);


  // Mock data for Phase 3 visual demonstration
  const stats = [
    { label: "Logic", value: 85, frictionActive: false },
    { label: "Drive", value: 72, frictionActive: false },
    { label: "Empathy", value: 45, frictionActive: false },
    { label: "Stability", value: 38, frictionActive: true },
  ];

  if (forecastError) {
    return (
      <div className="relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
        <div className="border border-red-500/50 bg-red-950/20 p-8 rounded-xl backdrop-blur-md max-w-lg w-full text-center shadow-[0_0_30px_rgba(255,0,0,0.2)]">
           <div className="text-red-500 text-4xl mb-4 font-bold">⚠</div>
           <h2 className="text-red-400 font-mono uppercase tracking-[0.2em] mb-4">Connection Failed</h2>
           <p className="text-red-200/80 font-mono text-xs uppercase tracking-widest">{forecastError}</p>
        </div>
      </div>
    );
  }

  if (!telemetry) {
    return (
      <div className="relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <WireframeMerkaba intensity={1} />
          </Canvas>
        </div>
        <div className="mt-48 z-20 flex flex-col items-center space-y-4">
          <div className="text-neon-gold text-sm font-mono tracking-[0.3em] uppercase animate-pulse">
            Synthesizing Energy Matrix
          </div>
          <div className="text-neon-purple text-xs font-mono tracking-widest opacity-70">
            Fetching Deep-Grid Coordinates...
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen w-full bg-background flex flex-col items-center justify-start py-12 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background aesthetic layers */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-gold/10 via-neon-purple/50 to-neon-amber/10 blur-[2px]" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[1px] bg-white/5" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-neon-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Array */}
      <header className="w-full max-w-6xl flex justify-between items-end border-b border-white/10 pb-4 mb-12 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-[0.2em] text-neon-gold uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
            Aether Network
          </h1>
          <p className="text-foreground/60 text-xs font-mono tracking-widest uppercase mt-1">
            Sovereign 05 // Primary Bulkhead <span className="opacity-50 inline-block ml-2 text-[10px] lowercase tracking-normal font-sans">(Current network node sector)</span>
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-neon-amber text-xs font-mono tracking-widest uppercase mb-1">
            Status: Synchronized <span className="text-foreground/50 inline-block ml-2 text-[10px] lowercase tracking-normal font-sans">(Biometrics linked)</span>
          </p>
          <div className="flex gap-1 justify-end">
             <div className="w-2 h-2 bg-neon-gold shadow-[0_0_5px_#ffd700]" />
             <div className="w-2 h-2 bg-neon-gold shadow-[0_0_5px_#ffd700]" />
             <div className="w-2 h-2 bg-neon-purple shadow-[0_0_5px_#9d00ff]" />
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-6xl flex flex-col items-center z-10 space-y-8">
        
        {/* Contextual Summary */}
        <p className="text-foreground/80 text-sm font-mono tracking-widest uppercase text-center max-w-2xl mb-2 mt-4">
          Real-time monitoring of your energy matrix and local cosmic environment.
        </p>

        {/* Live Celestial Telemetry Module (Moved to Top) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            {/* Next Full Moon */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-purple text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Next Full Moon</h3>
               <p className="text-white text-sm font-mono tracking-widest uppercase text-center">{formatLunarDate(telemetry.nextFullMoon)}</p>
            </div>

            {/* Next New Moon */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-purple text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Next New Moon</h3>
               <p className="text-white text-sm font-mono tracking-widest uppercase text-center">{formatLunarDate(telemetry.nextNewMoon)}</p>
            </div>

            {/* Cosmic Anomalies */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:col-span-2">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-purple text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Cosmic Anomalies</h3>
               <p className="text-white text-xs font-mono tracking-wider leading-relaxed text-center max-w-xl">{telemetry.cosmicAnomalies}</p>
            </div>

            {/* Daily Positive Affirmation */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:col-span-2">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-gold text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Daily Calibration Affirmation</h3>
               <p className="text-neon-gold text-sm font-mono tracking-wider italic leading-relaxed text-center max-w-2xl mb-4">
                 &quot;{telemetry.dailyAffirmation}&quot;
               </p>
               <div className="border-t border-neon-gold/20 w-3/4 max-w-md pt-4 mt-2">
                   <h4 className="text-[10px] text-neon-gold/60 font-mono tracking-widest uppercase mb-1 text-center">Sovereign Olfactory Anchor</h4>
                   <p className="text-xs text-white/80 font-mono tracking-wider text-center">
                     {getGroundingScent(tropicalSunSign)}
                   </p>
               </div>
            </div>

            {/* Kinetic Summary */}
            <div className="bg-panel/50 border border-neon-amber/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-amber/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:col-span-2">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-amber text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Kinetic Forecast Summary</h3>
               <p className="text-white text-xs font-mono tracking-wider leading-relaxed text-center max-w-2xl">
                 {telemetry.kineticSummary}
               </p>
            </div>

        </div>

        <div className="w-full h-px bg-white/10 my-4" />
        
        {/* Integrity Meter */}
        <div className="flex flex-col items-center w-full">
           <p className="text-foreground/50 text-[10px] font-mono tracking-widest uppercase mb-4 text-center max-w-xl">
             Current stability of your biometric rhythm
           </p>
           <SystemIntegrityMeter percentage={telemetry.integrityPercentage} />
        </div>

        {/* Conditional Friction Alert */}
        <div className="w-full flex justify-center mt-2 flex-col items-center">
           <p className="text-foreground/50 text-[10px] font-mono tracking-widest uppercase mb-4 text-center max-w-xl">
             Warning indicator for environmental atmospheric drag
           </p>
           <FrictionAlertBanner message={telemetry.kineticOutput} />
        </div>

        {/* Kinetic Stats */}
        <div className="w-full flex justify-center mt-4 flex-col items-center">
           <p className="text-foreground/50 text-[10px] font-mono tracking-widest uppercase mb-4 text-center max-w-xl">
             Live breakdown of your primary elemental drives
           </p>
           <KineticStatSheet stats={stats} />
        </div>

        {/* 9-Year Epicycle */}
        <div className="w-full flex justify-center mt-4 flex-col items-center pb-32">
           <p className="text-foreground/50 text-[10px] font-mono tracking-widest uppercase mb-4 text-center max-w-xl">
             Your active position within the numerological cycle
           </p>
           <div className="bg-panel/50 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center w-full max-w-2xl backdrop-blur-md relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-neon-gold text-[10px] font-mono tracking-widest uppercase mb-2 text-center">9-Year Epicycle Phase</h3>
             <p className="text-white text-lg font-mono tracking-widest uppercase">
               {telemetry.epicycle}
             </p>
           </div>
        </div>

      </main>

      {/* Grounding Canvas Modal Overlay */}
      <AnimatePresence>
        {isCanvasOpen && (
            <GroundingGeometryCanvas onClose={() => setIsCanvasOpen(false)} />
        )}
      </AnimatePresence>
      
      {/* Footer Decoration */}
      <footer className="absolute bottom-6 w-full text-center opacity-30 pointer-events-none">
        <p className="font-mono text-[10px] tracking-widest uppercase">Grid Lock Established. Ouroboros Active.</p>
      </footer>
    </motion.div>
  );
}
