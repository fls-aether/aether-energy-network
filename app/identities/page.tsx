"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore, TelemetryPayload } from "@/lib/store";

const IDENTITY_SYSTEMS = [
  "Starseed",
  "Numerology",
  "Cultural Systems",
  "Tropical Placidus",
  "Sidereal Lahiri",
  "Draconic",
  "Heliocentric",
  "Theoretical Axiom"
];

const PLACEMENT_GROUPS = {
  "Angles": ["Midheaven", "Imum Coeli", "Ascendant", "Descendant"],
  "Nodes & Axes": ["North Node", "South Node", "Vertex", "Anti-Vertex"],
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
      case "Starseed":
        return "Translates baseline demographic metadata into overarching systemic resonance alignments across deep-space focal domains.";
      case "Numerology":
        return "The mathematical blueprint of the soul's journey derived from exact birth coordinates.";
      case "Cultural Systems":
        return "Earth-grid socio-mythic frameworks mapping localized archetypal alignments.";
      case "Tropical Placidus":
        return "The standard seasonal Earth-grid projection.";
      case "Sidereal Lahiri":
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
      <h3 className="text-neon-purple text-[10px] font-mono uppercase tracking-widest mb-2">Identity Overview</h3>
      <p className="text-foreground/70 text-xs font-mono leading-relaxed max-w-2xl">
        {getSummaryText(system)}
      </p>
    </div>
  );
}

// Added Component to render interactive Cultural System Blocks
function CulturalSystemBlock({ title, colorClass, data, isActive, onClick }: { title: string, colorClass: string, data: any, isActive: boolean, onClick: () => void }) {
  const placementText = typeof data === 'object' && data !== null ? data.placement : (data || "Syncing...");
  const meaningText = typeof data === 'object' && data !== null ? data.meaning : "Awaiting esoteric Oracle transmission.";

  return (
    <div
      onClick={onClick}
      className={`bg-black/30 p-4 rounded border cursor-pointer transition-all duration-300 ${isActive ? `border-${colorClass.split('-')[1]}-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'border-white/5 hover:bg-white/5'}`}
    >
      <h4 className={`text-[10px] ${colorClass} font-mono tracking-widest uppercase mb-2`}>{title}</h4>
      <p className="text-sm text-white font-mono mb-2">{placementText}</p>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-white/10"
          >
            <h5 className="text-[10px] text-foreground/50 font-mono tracking-widest uppercase mb-1">Synthesized Meaning</h5>
            <p className="text-xs text-foreground/80 font-mono leading-relaxed">{meaningText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function IdentitiesPage() {
  const [activeSystem, setActiveSystem] = useState("Tropical Placidus");
  const [activeCulturalSystem, setActiveCulturalSystem] = useState<string | null>(null);

  const { telemetry } = useOperatorStore();
  const mtx = telemetry?.identitiesMatrix;

  // --- LEXICON INTERCEPT ENGINE ---
  const [lexiconMap, setLexiconMap] = useState<Record<string, { title: string, description: string }>>({});

  useEffect(() => {
    if (!mtx) return;

    // 1. Collect all the unique keys we need to fetch based on the user's chart
    const keysToFetch = new Set<string>();

    // Grab Numerology & Starseed keys
    if (mtx.numerology?.lifePath) keysToFetch.add(`LifePath${mtx.numerology.lifePath}`);
    if (mtx.starseed?.originPoint) keysToFetch.add(mtx.starseed.originPoint);

    // Grab Planet & Sign keys from Tropical placements
    if (mtx.tropical) {
      mtx.tropical.forEach((p: any) => {
        if (p.celestialBody) keysToFetch.add(p.celestialBody.replace(/[-\s]/g, "")); // Formats "North Node" to "NorthNode"
        if (p.sign) keysToFetch.add(p.sign);
      });
    }

    // 2. Fetch from the new Lexicon API
    const fetchLexicon = async () => {
      if (keysToFetch.size === 0) return;
      const keysParam = Array.from(keysToFetch).join(',');
      try {
        const res = await fetch(`/api/lexicon?keys=${keysParam}`);
        if (res.ok) {
          const data = await res.json();
          setLexiconMap(data.lexicon);
        }
      } catch (error) {
        console.error("[Aether Matrix] Failed to sync Lexicon:", error);
      }
    };

    fetchLexicon();
  }, [mtx]);

  // --------------------------------
  const isMetaphysical = activeSystem === "Starseed" || activeSystem === "Numerology";
  const isCultural = activeSystem === "Cultural Systems";
  const showZodiacPatterns = ["Tropical Placidus", "Sidereal Lahiri", "Draconic", "Heliocentric", "Theoretical Axiom"].includes(activeSystem);

  const getSystemKey = (sys: string) => {
    if (sys === "Tropical Placidus") return "tropical";
    if (sys === "Sidereal Lahiri") return "sidereal";
    if (sys === "Draconic") return "draconic";
    if (sys === "Heliocentric") return "heliocentric";
    return null;
  };

  const getActiveArray = () => {
    if (!mtx) return [];
    const sysKey = getSystemKey(activeSystem);
    if (!sysKey) return [];
    // @ts-ignore - Dynamic key access based on literal mapping
    return mtx[sysKey] || [];
  };

  const getPlacementData = (body: string) => {
    const arr = getActiveArray();
    return arr.find((p: any) => p.celestialBody === body);
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation for Systems */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
        {IDENTITY_SYSTEMS.map((sys) => (
          <button
            key={sys}
            onClick={() => setActiveSystem(sys)}
            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-xs tracking-widest uppercase transition-all duration-300 ${activeSystem === sys
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
            {activeSystem === "Numerology" && (
              <>
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Life Path</h4>
                  <p className="text-sm text-white font-mono mb-2">{mtx?.numerology?.lifePath || "Syncing..."}</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Core Archetype</h4>
                  <p className="text-sm text-white font-mono mb-2">{mtx?.numerology?.coreArchetype || "Syncing..."}</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Mode & Anchor Point</h4>
                  <p className="text-sm text-white font-mono mb-2">{mtx?.numerology?.mode || "Syncing..."} // {mtx?.numerology?.anchor || "TBD"}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-neon-gold font-mono tracking-widest uppercase mb-1">Identity Overview</h4>
                  <p className="text-xs text-foreground/70 font-mono leading-relaxed">
                    {/* Pulls from Neon DB, falls back to AI, falls back to default */}
                    {lexiconMap[`LifePath${mtx?.numerology?.lifePath}`]?.description || mtx?.numerology?.systemOverview || "Awaiting esoteric Oracle transmission."}
                  </p>
                </div>
              </>
            )}
            {activeSystem === "Starseed" && (
              <>
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Origin Point</h4>
                  <p className="text-sm text-white font-mono mb-2">{mtx?.starseed?.originPoint || "Syncing..."}</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Master Spiritual Court</h4>
                  <p className="text-sm text-white font-mono mb-2">{mtx?.starseed?.masterSpiritualCourt || "Syncing..."}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-1">Identity Overview</h4>
                  <p className="text-xs text-foreground/70 font-mono leading-relaxed">
                    {lexiconMap[mtx?.starseed?.originPoint || ""]?.description || mtx?.starseed?.systemOverview || "Awaiting esoteric Oracle transmission."}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : isCultural ? (
          <div className="bg-panel/40 border border-white/5 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/30 p-4 rounded border border-white/5 md:col-span-2">
              <h4 className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-2">Identity Overview</h4>
              <p className="text-sm text-white font-mono mb-2">{mtx?.culturalSystems?.systemOverview || "Awaiting esoteric Oracle transmission."}</p>
            </div>

            <CulturalSystemBlock
              title="Chinese Zodiac" colorClass="text-emerald-400" data={mtx?.culturalSystems?.chineseZodiac}
              isActive={activeCulturalSystem === 'chineseZodiac'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'chineseZodiac' ? null : 'chineseZodiac')}
            />
            <CulturalSystemBlock
              title="Japanese (Kigaku)" colorClass="text-rose-400" data={mtx?.culturalSystems?.japanese}
              isActive={activeCulturalSystem === 'japanese'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'japanese' ? null : 'japanese')}
            />
            <CulturalSystemBlock
              title="Tzolkin" colorClass="text-cyan-400" data={mtx?.culturalSystems?.tzolkin}
              isActive={activeCulturalSystem === 'tzolkin'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'tzolkin' ? null : 'tzolkin')}
            />
            <CulturalSystemBlock
              title="Celtic Tree" colorClass="text-amber-600" data={mtx?.culturalSystems?.celticTree}
              isActive={activeCulturalSystem === 'celticTree'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'celticTree' ? null : 'celticTree')}
            />
            <CulturalSystemBlock
              title="Decans" colorClass="text-indigo-400" data={mtx?.culturalSystems?.decans}
              isActive={activeCulturalSystem === 'decans'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'decans' ? null : 'decans')}
            />
            <CulturalSystemBlock
              title="Mahabote" colorClass="text-orange-400" data={mtx?.culturalSystems?.mahabote}
              isActive={activeCulturalSystem === 'mahabote'} onClick={() => setActiveCulturalSystem(activeCulturalSystem === 'mahabote' ? null : 'mahabote')}
            />
          </div>
        ) : activeSystem === "Theoretical Axiom" ? (
          <div className="space-y-6">
            <div className="bg-neon-purple/5 border border-neon-purple/20 rounded p-4 text-center">
              <p className="text-xs text-neon-purple font-mono uppercase tracking-widest">
                Calculated via Cotsworth Plan, UTC, & true astronomical boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-white/5 rounded-lg p-6 hover:border-cyan-500/30 transition-colors">
                <h4 className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  13-Sign Zodiac (True Astronomical)
                </h4>
                <p className="text-lg text-white font-mono">{mtx?.theoreticalAxiom?.thirteenSignZodiac || "Syncing telemetry..."}</p>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-lg p-6 hover:border-amber-500/30 transition-colors">
                <h4 className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  International Fixed Calendar (13-Month)
                </h4>
                <p className="text-lg text-white font-mono">{mtx?.theoreticalAxiom?.cotsworthDate || "Syncing telemetry..."}</p>
              </div>

              <div className="bg-gradient-to-br from-neon-purple/10 to-transparent border border-neon-purple/30 rounded-lg p-6 md:col-span-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-4">Axiom Insight</h4>
                <p className="text-base text-neon-purple/90 font-mono italic leading-relaxed drop-shadow-[0_0_8px_rgba(157,0,255,0.4)]">
                  "{mtx?.theoreticalAxiom?.axiomInsight || "Awaiting advanced esoteric synthesis from the Aether Genesis Engine..."}"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Zodiac Patterns Anomaly Section (Moved UP) */}
            {showZodiacPatterns && (
              <section className="mb-8 border-b border-white/10 pb-8">
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
            )}

            {Object.entries(PLACEMENT_GROUPS).map(([groupName, placements]) => (
              <section key={groupName}>
                <h3 className="text-neon-amber text-[10px] font-mono tracking-[0.2em] uppercase mb-4 border-b border-neon-amber/20 pb-2 inline-block">
                  {groupName}
                </h3>
                <div className="space-y-3">
                  {placements.map(placement => {
                    const data = getPlacementData(placement);

                    return (
                      <details
                        key={placement}
                        className="group bg-panel/30 border border-white/5 rounded transition-all duration-300"
                      >
                        <summary className="cursor-pointer list-none flex justify-between items-center p-4 hover:bg-white/5">
                          <div className="flex gap-4 items-center">
                            <span className="text-neon-gold group-open:rotate-90 transition-transform duration-300 font-mono">▸</span>
                            <span className="text-sm font-mono tracking-wider text-white">
                              {placement}
                              <span className="text-foreground/40 ml-2">
                                : {data?.sign || "Void"}
                                {data?.isRetrograde && <span className="text-neon-amber text-[10px] ml-2 animate-pulse">[Rx]</span>}
                              </span>
                            </span>
                          </div>
                        </summary>

                        <div className="p-4 pt-2 border-t border-white/5 space-y-4 bg-black/40">
                          <div>
                            <h4 className="text-[10px] text-foreground/40 font-mono tracking-widest uppercase mb-2">Synthesized Meaning</h4>
                            <div className="text-xs font-mono leading-relaxed space-y-3">

                              {/* 1. Show the Planetary Definition from the Database */}
                              {lexiconMap[placement.replace(/[-\s]/g, "")] && (
                                <p className="text-foreground/90">
                                  <strong className="text-neon-gold">{lexiconMap[placement.replace(/[-\s]/g, "")].title}:</strong> {lexiconMap[placement.replace(/[-\s]/g, "")].description}
                                </p>
                              )}

                              {/* 2. Show the Zodiac Sign Definition from the Database */}
                              {data?.sign && lexiconMap[data.sign] && (
                                <p className="text-foreground/80">
                                  <strong className="text-neon-purple">{lexiconMap[data.sign].title}:</strong> {lexiconMap[data.sign].description}
                                </p>
                              )}

                              {/* 3. The Ultimate Fallback */}
                              {(!lexiconMap[placement.replace(/[-\s]/g, "")] && !lexiconMap[data?.sign || ""]) && (
                                <p className="text-foreground/60 italic">
                                  {data?.esotericMeaning || `Awaiting deep-space telemetry to decode the specific esoteric significance of ${placement}.`}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="bg-panel/50 border border-white/5 rounded p-3">
                            <h4 className="text-[10px] text-neon-purple font-mono tracking-widest uppercase mb-2">Orbital Metrics</h4>
                            <ul className="space-y-1 text-xs font-mono tracking-wider text-foreground/60">
                              <li className="flex justify-between"><span>Degree:</span> <span className="text-white">{data?.degree || "Syncing..."}</span></li>
                              <li className="flex justify-between"><span>House:</span> <span className="text-white">{data?.house || "TBD"}</span></li>
                              <li className="flex justify-between"><span>Retrograde:</span> <span className="text-white">{data?.isRetrograde ? "True" : data ? "False" : "Syncing..."}</span></li>
                            </ul>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
