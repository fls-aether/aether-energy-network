"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SystemIntegrityMeter } from "./SystemIntegrityMeter";
import { FrictionAlertBanner } from "./FrictionAlertBanner";
import { KineticStatSheet } from "./KineticStatSheet";
import { GroundingGeometryCanvas } from "./GroundingGeometryCanvas";
import { WireframeMerkaba } from "./WireframeMerkaba";
import { useState, useEffect } from "react";
import { useOperatorStore } from "@/lib/store";
import { Canvas } from "@react-three/fiber";

interface TelemetryPayload {
  integrityPercentage: number;
  kineticOutput: string;
  kineticSummary: string;
  epicycle: string;
  nextFullMoon: string;
  nextNewMoon: string;
  cosmicAnomalies: string;
  dailyAffirmation: string;
}

export function SovereignDashboard() {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);

  const { operatorDetails } = useOperatorStore();

  useEffect(() => {
    async function fetchForecast() {
      if (!operatorDetails) return;
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
        setTelemetry(data);
      } catch (e) {
        console.error("Forecast hydration failed:", e);
      }
    }
    fetchForecast();
  }, [operatorDetails]);

  // Mock data for Phase 3 visual demonstration
  const stats = [
    { label: "Logic", value: 85, frictionActive: false },
    { label: "Drive", value: 72, frictionActive: false },
    { label: "Empathy", value: 45, frictionActive: false },
    { label: "Stability", value: 38, frictionActive: true },
  ];

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
            Synthesizing Astral Telemetry
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
            Sovereign OS // Primary Bulkhead
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-neon-amber text-xs font-mono tracking-widest uppercase mb-1">
            Status: Synchronized
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
        
        {/* Top: Integrity Meter */}
        <div className="flex justify-center w-full">
           <SystemIntegrityMeter percentage={telemetry.integrityPercentage} />
        </div>

        {/* Middle: Conditional Friction Alert */}
        <FrictionAlertBanner message={telemetry.kineticOutput} />

        {/* Bottom: Kinetic Stats */}
        <div className="w-full flex justify-center mt-4">
           <KineticStatSheet stats={stats} />
        </div>

        {/* 9-Year Epicycle */}
        <div className="w-full flex justify-center mt-8">
           <div className="bg-panel/50 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center w-full max-w-2xl backdrop-blur-md relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-neon-gold text-[10px] font-mono tracking-widest uppercase mb-2 text-center">9-Year Epicycle Phase</h3>
             <p className="text-white text-lg font-mono tracking-widest uppercase">
               {telemetry.epicycle}
             </p>
           </div>
        </div>

        {/* Live Celestial Telemetry Module */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pb-32">
            
            {/* Next Full Moon */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-purple text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Next Full Moon</h3>
               <p className="text-white text-sm font-mono tracking-widest uppercase text-center">{telemetry.nextFullMoon}</p>
            </div>

            {/* Next New Moon */}
            <div className="bg-panel/50 border border-neon-purple/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-md relative overflow-hidden group transition-all hover:border-neon-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-neon-purple text-[10px] font-mono tracking-widest uppercase mb-2 text-center">Next New Moon</h3>
               <p className="text-white text-sm font-mono tracking-widest uppercase text-center">{telemetry.nextNewMoon}</p>
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
               <p className="text-neon-gold text-sm font-mono tracking-wider italic leading-relaxed text-center max-w-2xl">
                 &quot;{telemetry.dailyAffirmation}&quot;
               </p>
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

        {/* Removed Telemetry Scaffolding per Phase 20 */}

        {/* Access Button for Grounding Canvas */}
        <div className="w-full flex justify-center mt-8 pb-12 z-20">
            <button
                onClick={() => setIsCanvasOpen(true)}
                className="group relative px-8 py-3 bg-black/40 border border-neon-gold/30 rounded-full overflow-hidden transition-all duration-300 hover:border-neon-gold/80 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] backdrop-blur-sm"
            >
                <div className="absolute inset-0 w-0 bg-neon-gold/10 transition-all duration-500 ease-out group-hover:w-full" />
                <span className="relative z-10 text-neon-gold text-xs font-mono tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                    Access Tactile Canvas
                </span>
            </button>
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
