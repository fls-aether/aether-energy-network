"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore } from "@/lib/store";

export default function ConnectionsPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [resonanceDetected, setResonanceDetected] = useState(false);
  
  const { syncCode, confirmedConnections } = useOperatorStore();
  
  const displayCode = syncCode || "AWT-XXXXXX-XXX";

  const checkResonance = (code: string) => {
    const parts = code.toUpperCase().split('-');
    if (parts.length >= 2 && parts[1].length === 6) {
      const mm = parts[1].slice(0, 2);
      const yy = parts[1].slice(4, 6);
      const yyNum = parseInt(yy, 10);
      const is84to88 = yyNum >= 84 && yyNum <= 88;
      const is96to99 = yyNum >= 96 && yyNum <= 99;
      
      if ((mm === '03' || mm === '10') && is84to88) return true;
      if ((mm === '06' || mm === '12') && is96to99) return true;
    }
    return false;
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim() === "") return;
    
    setIsSyncing(true);
    
    setTimeout(() => {
      setIsSyncing(false);
      if (checkResonance(inviteCode)) {
        setResonanceDetected(true);
        setTimeout(() => setResonanceDetected(false), 5000);
      }
      setInviteCode("");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-12 font-mono">
      
      {/* Header Context */}
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-white">Grid Connections</h1>
        <p className="text-foreground/50 text-xs tracking-widest uppercase mt-2">Zero-Trust Mutual Authentication Layer</p>
      </header>

      {/* Operator Code & Invite Mechanism */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invite Code Display */}
        <div className="bg-panel/40 border border-neon-gold/20 rounded-lg p-8 backdrop-blur-md relative group flex flex-col justify-center items-center">
            <div className="absolute inset-0 bg-neon-gold/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <span className="text-xs text-neon-gold tracking-widest uppercase mb-4 text-center">Your Operator Code</span>
            <div className="bg-black/50 border border-white/10 px-6 py-3 rounded text-center w-full max-w-xs shadow-inner">
               <span className="text-lg tracking-[0.3em] text-white select-all">{displayCode}</span>
            </div>
            <button 
              className="mt-4 text-[10px] uppercase tracking-widest text-foreground/50 hover:text-neon-gold transition-colors"
              onClick={() => navigator.clipboard.writeText(displayCode)}
            >
               [ Copy to Clipboard ]
            </button>
        </div>

        {/* Input Field */}
        <div className="bg-panel/40 border border-neon-purple/20 rounded-lg p-8 backdrop-blur-md relative group">
            <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="text-xs text-neon-purple tracking-widest uppercase mb-6 text-center">Establish Connection</h3>
            <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
                <div className="relative">
                 <input 
                   type="text" 
                   value={inviteCode}
                   onChange={(e) => setInviteCode(e.target.value)}
                   placeholder="e.g. XX-MMDDYY-XXX"
                   disabled={isSyncing}
                   className="w-full bg-black/60 border border-white/20 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple text-white px-4 py-3 rounded text-sm tracking-widest uppercase outline-none transition-all placeholder:text-foreground/30 text-center disabled:opacity-50"
                 />
               </div>
               <button 
                 type="submit"
                 disabled={!inviteCode || isSyncing}
                 className="w-full bg-neon-purple/10 border border-neon-purple hover:bg-neon-purple hover:text-white transition-all text-neon-purple uppercase tracking-widest text-xs py-3 rounded disabled:opacity-30 disabled:hover:bg-neon-purple/10 disabled:hover:text-neon-purple flex justify-center items-center gap-2 relative overflow-hidden group"
               >
                 <span className="relative z-10">{isSyncing ? "Syncing..." : "Transmit Sync Request"}</span>
                 {isSyncing && <div className="absolute inset-0 bg-neon-purple/20 blur-sm animate-pulse" />}
               </button>
            </form>

            <AnimatePresence>
              {resonanceDetected && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-max bg-neon-purple border border-white/50 text-white px-6 py-2 rounded shadow-[0_0_20px_rgba(188,19,254,0.8)] z-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase">High-Level Resonance Detected</span>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </section>

      {/* Confirmed Connections Grid */}
      <section className="mt-8 space-y-6">
         <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-2 h-2 rounded-full bg-neon-amber shadow-[0_0_8px_rgba(255,140,0,0.8)]" />
            <h2 className="text-sm text-white uppercase tracking-[0.2em]">Confirmed Links</h2>
            <span className="ml-auto text-xs text-foreground/50 tracking-widest uppercase">Nodes: {confirmedConnections.length}</span>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Active Connections */}
            {confirmedConnections.map((conn) => (
              <div 
                key={conn.id}
                className="bg-panel/40 border border-neon-gold/30 rounded-lg aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-neon-gold transition-colors"
                title={`Synced: ${new Date(conn.timestamp).toLocaleDateString()}`}
              >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-10 h-10 rounded-full border border-neon-gold/50 flex items-center justify-center mb-3 bg-black/40 shadow-inner group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-shadow">
                    <span className="text-neon-gold text-lg">⌬</span>
                  </div>
                  <span className="text-[10px] text-white font-mono tracking-widest uppercase text-center leading-tight">
                    {conn.name}
                  </span>
              </div>
            ))}

            {/* Locked Placeholders */}
            {[...Array(Math.max(0, 10 - confirmedConnections.length))].map((_, i) => (
              <div 
                key={`locked-${i}`} 
                className="bg-black/30 border border-white/5 rounded-lg aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden group"
              >
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  
                  <span className="text-foreground/20 group-hover:text-foreground/40 transition-colors text-2xl mb-2">⎈</span>
                  <span className="text-[9px] text-foreground/20 font-mono tracking-widest uppercase -mt-1 group-hover:text-foreground/40 transition-colors">Locked</span>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
}
