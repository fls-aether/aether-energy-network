"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OPERATOR_IDENTITY } from "@/lib/identityPayload";

const IDENTITY_SYSTEMS = [
  "Starseed Identity", 
  "Numerology Identity", 
  "Tropical Placidus", 
  "Standard Sidereal Lahiri", 
  "Draconic", 
  "Heliocentric", 
  "Theoretical Axiom"
];

const PLACEMENT_GROUPS = {
  "Angles": ["MC", "IC", "ASC", "DSC"],
  "Nodes & Axes": ["NN", "SN", "Vertex", "Anti-Vertex"],
  "Luminaries": ["Sun", "Moon", "Selene", "Lilith"],
  "Planets": ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
  "High-Orbitals 1": ["Earth", "Chiron", "Astraea", "Hygiea"],
  "High-Orbitals 2": ["Eris", "Eros", "Ceres", "Haumea"],
  "Foundational": ["Vesta", "Part of Fortune", "Sedna", "Juno"],
  "Minor": ["Pallas", "Pholus", "MakeMake"]
};

// Added Inline Component Definition inside the file
function IdentitySummary({ system }: { system: string }) {
  const getSummaryText = (sys: string) => {
    switch (sys) {
      case "Starseed Identity":
        return "Translates baseline demographic metadata into overarching systemic resonance alignments across deep-space focal domains.";
      case "Numerology Identity":
        return "Decodes the underlying numeric frequencies of assigned designations to output core operational axioms.";
      case "Tropical Placidus":
        return "The standard earthly seasonal framework, plotting chronological natal positions to psychological architectures.";
      case "Standard Sidereal Lahiri":
        return "Calculates alignments based on actual current celestial positioning against the fixed galactic backdrop.";
      case "Draconic":
        return "Recalibrates the chart against the lunar nodes, accessing the deep, undercurrent soul-level mission directives.";
      case "Heliocentric":
        return "Shifts the focal node to the Sun, removing retrograde phenomena to map your localized influence on the macro-system.";
      case "Theoretical Axiom":
        return "A speculative rendering mapping probable deviations based on hypothetical multi-dimensional orbital fluctuations.";
      default:
        return "Retrieving base operational parameters...";
    }
  };

  return (
    <div className="bg-neon-purple/5 border-l-2 border-neon-purple p-4 mb-8">
      <h3 className="text-neon-purple text-[10px] font-mono uppercase tracking-widest mb-2">Systems Overview</h3>
      <p className="text-foreground/70 text-xs font-mono leading-relaxed max-w-2xl">
        {getSummaryText(system)}
      </p>
    </div>
  );
}

export default function IdentitiesPage() {
  const [activeSystem, setActiveSystem] = useState(IDENTITY_SYSTEMS[2]); // Default Tropical Placidus

  const isMetaphysical = activeSystem === "Starseed Identity" || activeSystem === "Numerology Identity";
  
  const getSystemKey = (sys: string) => {
    if (sys === "Tropical Placidus") return "tropical";
    if (sys === "Draconic") return "draconic";
    return null;
  };

  const getInterpretation = (placement: string) => {
    const sysKey = getSystemKey(activeSystem);
    if (!sysKey) return null;
    return OPERATOR_IDENTITY.interpretations[sysKey]?.[placement];
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation for Systems */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
        <h2 className="text-neon-gold text-xs font-mono tracking-widest uppercase mb-6 px-4">Archives</h2>
        {IDENTITY_SYSTEMS.map((sys) => (
          <button
            key={sys}
            onClick={() => setActiveSystem(sys)}
            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
              activeSystem === sys 
                ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50 shadow-[0_0_15px_rgba(157,0,255,0.2)]" 
                : "text-foreground/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            {sys}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow space-y-8 relative">
        <header className="mb-2">
          <h1 className="text-2xl md:text-3xl text-white font-mono uppercase tracking-[0.2em]">{activeSystem}</h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-neon-purple/50 to-transparent mt-4" />
        </header>

        {/* Top Summary Block */}
        <IdentitySummary system={activeSystem} />

        {isMetaphysical ? (
           <div className="bg-panel/40 border border-white/5 rounded-lg p-8 space-y-8">
             {activeSystem === "Numerology Identity" && (
                <>
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Life Path</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Numerology Identity"].lifePath}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.lifePath22}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Core Archetype</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Numerology Identity"].coreArchetype}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.coreArchetype}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Mode</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Numerology Identity"].mode}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.mode}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Anchor Point</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Numerology Identity"].anchor}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.tripleEarth}</p>
                  </div>
                </>
             )}
             {activeSystem === "Starseed Identity" && (
                <>
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Chinese Zodiac</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Starseed Identity"].chineseZodiac}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.chineseZodiac}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Origin Point</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Starseed Identity"].originPoint}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.origin}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Master Spiritual Court</h4>
                    <p className="text-sm text-white font-mono mb-2">{OPERATOR_IDENTITY.metaphysical["Starseed Identity"].masterSpiritualCourt}</p>
                    <p className="text-xs text-foreground/70 font-mono leading-relaxed">{OPERATOR_IDENTITY.interpretations.metaphysical.spiritualCourt}</p>
                  </div>
                </>
             )}
           </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(PLACEMENT_GROUPS).map(([groupName, placements]) => (
              <section key={groupName}>
                <h3 className="text-neon-amber text-[10px] font-mono tracking-[0.2em] uppercase mb-4 border-b border-neon-amber/20 pb-2 inline-block">
                  {groupName}
                </h3>
                <div className="space-y-3">
                  {placements.map(placement => (
                    <details 
                       key={placement}
                       className="group bg-panel/30 border border-white/5 rounded transition-all duration-300"
                    >
                      <summary className="cursor-pointer list-none flex justify-between items-center p-4 hover:bg-white/5">
                         <div className="flex gap-4 items-center">
                            <span className="text-neon-gold group-open:rotate-90 transition-transform duration-300 font-mono">▸</span>
                            <span className="text-sm font-mono tracking-wider text-white">
                              {placement} <span className="text-foreground/40 ml-2">: {OPERATOR_IDENTITY.astrological[activeSystem]?.[placement] || "Void"}</span>
                            </span>
                         </div>
                      </summary>
                      
                      <div className="p-4 pt-2 border-t border-white/5 space-y-4 bg-black/40">
                         <div>
                           <h4 className="text-[10px] text-foreground/40 font-mono tracking-widest uppercase mb-1">Synthesized Meaning</h4>
                           <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                             {getInterpretation(placement) || `Awaiting deep-space telemetry to decode the specific esoteric significance of ${placement} within the ${activeSystem} layer. Current resonance points to latent potential.`}
                           </p>
                         </div>
                         
                         <div className="bg-panel/50 border border-white/5 rounded p-3">
                           <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-2">Orbital Metrics</h4>
                           <ul className="space-y-1 text-xs font-mono tracking-wider text-foreground/60">
                             <li className="flex justify-between"><span>Degree:</span> <span className="text-white">--° --'</span></li>
                             <li className="flex justify-between"><span>House:</span> <span className="text-white">--</span></li>
                             <li className="flex justify-between"><span>Retrograde:</span> <span className="text-white">False</span></li>
                           </ul>
                         </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Zodiac Patterns Anomaly Section */}
        <section className="mt-16 pt-8 border-t border-white/10">
           <h3 className="text-neon-purple text-xs font-mono tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
             <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
             Zodiac Patterns & Anomalies
           </h3>
           <div className="bg-neon-purple/5 border border-neon-purple/20 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-foreground/60 text-xs font-mono uppercase tracking-widest leading-relaxed">
                Scan complete. No rare grand crosses or stelliums detected in this specific layer. Latent geometric resonance stable.
              </p>
           </div>
        </section>

      </main>
    </div>
  );
}
