"use client";

import { motion } from "framer-motion";

export interface CodexEntry {
  id: string;
  timestamp: string;
  text: string;
}

interface NarrativeCodexProps {
  codexLore?: string;
  systemInsight?: string;
}

export function NarrativeCodex({ codexLore, systemInsight }: NarrativeCodexProps) {
  return (
    <div className="w-full bg-neon-amber/5 border-2 border-neon-amber/20 rounded-sm p-6 relative overflow-hidden h-[400px] flex flex-col shadow-[inset_0_0_40px_rgba(255,170,0,0.05)]">
      
      {/* Cyber Parchement Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-amber/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+')] opacity-50 pointer-events-none mix-blend-overlay" />
      
      {/* Decorative Runes / Headers */}
      <div className="flex justify-between items-center mb-6 border-b border-neon-amber/30 pb-4 relative z-10">
          <span className="font-mono text-neon-amber text-xs tracking-[0.4em] uppercase font-bold drop-shadow-[0_0_5px_rgba(255,170,0,0.5)]">
            Aethereal Codex
          </span>
          <span className="font-mono text-neon-amber/50 text-[10px] tracking-widest">
            v1.0.9
          </span>
      </div>

      {/* Scrollable Text Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 space-y-4">
        {codexLore ? (
           <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="pl-4 border-l border-neon-amber/40"
           >
              {systemInsight && (
                <div className="text-[10px] font-mono text-neon-amber/80 bg-neon-amber/10 p-2 rounded mb-4 tracking-wider border border-neon-amber/20">
                  <span className="font-bold text-neon-amber drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]">SYSTEM INSIGHT:</span> {systemInsight}
                </div>
              )}
              
              <div className="text-sm font-mono text-neon-amber/90 leading-relaxed tracking-wide shadow-sm whitespace-pre-wrap">
                  {codexLore}
              </div>
           </motion.div>
        ) : (
          // Skeletal Loading Lines
          <div className="space-y-6">
             {[1, 2, 3].map((i) => (
                <div key={i} className="pl-4 border-l border-neon-amber/10 space-y-2">
                   <div className="h-3 w-20 bg-neon-amber/10 animate-pulse rounded" />
                   <div className="h-4 w-full bg-neon-amber/5 animate-pulse rounded" />
                   <div className="h-4 w-5/6 bg-neon-amber/5 animate-pulse rounded" />
                </div>
             ))}
          </div>
        )}
      </div>

    </div>
  );
}
