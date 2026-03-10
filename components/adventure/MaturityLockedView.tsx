"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function MaturityLockedView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-64 border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center p-8 backdrop-blur-md relative overflow-hidden"
    >
        {/* Warning Glitch Layer */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDU1IiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay pointer-events-none" />
        
        <Lock className="w-12 h-12 text-red-500 mb-4 opacity-70" />
        
        <h3 className="text-xl font-mono tracking-[0.2em] uppercase text-red-500 mb-2 drop-shadow-[0_0_8px_rgba(255,0,85,0.5)] text-center">
            Temporal Clearance Denied
        </h3>
        
        <p className="text-foreground/50 text-xs font-mono uppercase tracking-widest text-center max-w-sm mt-2">
            Operator age metric insufficient for mature archetype gallery access. Required: 18+ Cycles.
        </p>
    </motion.div>
  );
}
