"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore } from "@/lib/store";
import { calculateResonanceBlueprint } from "@/lib/resonanceMatrix";

export default function ConnectionsPage() {
  const { syncCode, setSyncCode, confirmedConnections } = useOperatorStore();
  
  // Handshake UI States
  const [activeTab, setActiveTab] = useState<'invite' | 'links'>('links');
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [inviteTarget, setInviteTarget] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const blueprint = calculateResonanceBlueprint(syncCode || "DEFAULT");

  // Generate Sync Code if missing
  useEffect(() => {
    if (!syncCode) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setSyncCode(`AWT-${code}`);
    }
  }, [syncCode, setSyncCode]);

  // Mock Connected Operators for Phase 4
  const mockRoster = [
    { id: 'cipher', name: 'Operator: Cipher', sign: 'Aquarius', class: 'Spectral Architect' },
    { id: 'nova', name: 'Operator: Nova', sign: 'Leo', class: 'Solar Sentinel' }
  ];

  const handleSendInvite = () => {
    if (!inviteTarget) return;
    setIsSendingInvite(true);
    setTimeout(() => {
      setIsSendingInvite(false);
      setInviteTarget("");
      alert("Invite signal broadcast to: " + inviteTarget);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-12 font-mono">
      
      {/* Header Context */}
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-white">Grid Connections</h1>
        <p className="text-foreground/50 text-xs tracking-widest uppercase mt-2">Zero-Trust Mutual Authentication Layer</p>
      </header>

      {/* Split Dashboard View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Grid Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Your Identity Card */}
           <div className="bg-panel/40 border border-neon-purple/30 rounded-lg p-6 backdrop-blur-md">
              <h3 className="text-[10px] text-neon-purple uppercase tracking-[0.2em] font-bold mb-4">Sovereign Origin</h3>
              <div className="bg-black/40 border border-white/5 p-4 rounded text-center mb-6">
                 <span className="text-[9px] text-white/40 uppercase block mb-1">Your Operator Code</span>
                 <span className="text-xl text-white font-bold tracking-widest">{syncCode}</span>
              </div>
              
              <div className="space-y-4">
                 <div className="relative">
                    <input 
                      type="text" value={inviteTarget} onChange={(e) => setInviteTarget(e.target.value)}
                      placeholder="Email or Phone..."
                      className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded font-mono text-xs outline-none focus:border-neon-purple transition-all"
                    />
                 </div>
                 <button 
                   onClick={handleSendInvite} disabled={!inviteTarget || isSendingInvite}
                   className="w-full py-3 bg-neon-purple/20 border border-neon-purple/50 text-neon-purple text-xs uppercase tracking-widest hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50"
                 >
                    {isSendingInvite ? "Broadcasting..." : "[ Send Connection Request ]"}
                 </button>
              </div>
           </div>

           {/* Confirmed Grid Connections */}
           <div className="bg-panel/20 border border-white/5 rounded-lg overflow-hidden">
              <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                 <span className="text-[10px] text-white/50 uppercase tracking-widest">Operator Roster</span>
                 <span className="text-[10px] text-neon-gold">Nodes: 2</span>
              </div>
              <div className="divide-y divide-white/5">
                 {mockRoster.map(op => (
                    <button 
                      key={op.id}
                      onClick={() => setSelectedOperator(op)}
                      className={`w-full p-4 flex items-center gap-3 transition-colors text-left hover:bg-white/5 ${selectedOperator?.id === op.id ? 'bg-neon-gold/5 border-l-2 border-neon-gold' : ''}`}
                    >
                       <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-neon-gold">⌬</div>
                       <div className="flex flex-col">
                          <span className="text-xs text-white font-bold uppercase">{op.name}</span>
                          <span className="text-[9px] text-white/30 uppercase">{op.class} // {op.sign}</span>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Ideal Resonance Blueprint */}
        <div className="bg-panel/40 border border-neon-gold/30 rounded-lg p-6 backdrop-blur-md mb-6">
           <h3 className="text-[10px] text-neon-gold uppercase tracking-[0.2em] font-bold mb-4">Ideal Resonance Blueprint</h3>
           <div className="space-y-4">
             <div className="bg-black/30 p-3 rounded border border-white/5">
               <span className="text-[9px] text-neon-gold uppercase block mb-1">Primary Anchor</span>
               <span className="text-xs text-white uppercase font-bold">{blueprint.primaryAnchor.archetype}</span>
               <span className="text-[10px] text-white/50 block mt-1 pb-2">Ideal Origin: {blueprint.primaryAnchor.idealYears}</span>
               <p className="text-[10px] text-foreground/70 italic border-t border-white/10 pt-2 lg:leading-relaxed">"{blueprint.primaryAnchor.synergyReasoning}"</p>
             </div>
             <div className="bg-black/30 p-3 rounded border border-white/5">
               <span className="text-[9px] text-neon-purple uppercase block mb-1">Secondary Catalyst</span>
               <span className="text-xs text-white uppercase font-bold">{blueprint.secondaryCatalyst.archetype}</span>
               <span className="text-[10px] text-white/50 block mt-1 pb-2">Ideal Origin: {blueprint.secondaryCatalyst.idealYears}</span>
               <p className="text-[10px] text-foreground/70 italic border-t border-white/10 pt-2 lg:leading-relaxed">"{blueprint.secondaryCatalyst.synergyReasoning}"</p>
             </div>
           </div>
        </div>

        {/* RIGHT: Synastry Engine / Resonance Dashboard */}
        <div className="lg:col-span-8 overflow-hidden min-w-0">
           <AnimatePresence mode="wait">
              {selectedOperator ? (
                 <motion.div 
                   key={selectedOperator.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                    {/* Analysis Header */}
                    <div className="bg-black/40 p-6 rounded-lg border border-neon-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                       <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-1">Aether Energy Analysis</h2>
                       <p className="text-[10px] text-neon-gold uppercase tracking-[0.2em]">Synastry: You + {selectedOperator.name}</p>
                    </div>

                    {/* Resonance Card */}
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                       <h3 className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-4">Resonance Overview</h3>
                       <p className="text-sm text-foreground/80 leading-relaxed italic">
                         "The convergence of your {selectedOperator.class} matrix with local telemetry indicates a high-frequency harmonic. The air of {selectedOperator.sign} complements your current drive, creating a stabilized vortex for collaborative expansion. Emotional grounding is required for long-term synchronization."
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Activities Card */}
                       <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-4">Recommended Activities</h3>
                          <ul className="space-y-3">
                             {["Astral Sandbox collaboration", "Kinetic calibration exercises", "Shared sensory grounding sessions"].map((act, i) => (
                                <li key={i} className="flex items-start gap-3">
                                   <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                                   <span className="text-xs text-white/70 uppercase font-mono">{act}</span>
                                </li>
                             ))}
                          </ul>
                       </div>

                       {/* Discussion Vectors Card */}
                       <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <ul className="space-y-3">
                             {["Bridging elemental gaps via sign logic", "Multi-dimensional career trajectories", "Optimizing collective epicyclic output"].map((vec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                   <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 shrink-0" />
                                   <span className="text-xs text-white/70 uppercase font-mono">{vec}</span>
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    <div className="bg-red-950/20 border border-red-500/30 p-4 rounded text-center">
                       <p className="text-[10px] text-red-400 uppercase tracking-widest">
                         [ CAUTION: Energy overlap exceeds 85% safety baseline ]
                       </p>
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full min-h-[400px] border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-12 text-center"
                 >
                    <div className="text-4xl text-white/10 mb-6">⌬</div>
                    <h3 className="text-lg text-white/30 uppercase tracking-[0.2em] mb-2 font-bold">Select Node</h3>
                    <p className="max-w-xs text-xs text-white/20 uppercase tracking-widest leading-loose">
                      Initialize synastry analysis by selecting a confirmed grid connection from your roster.
                    </p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
