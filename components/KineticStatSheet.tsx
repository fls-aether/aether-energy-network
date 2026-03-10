"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number; // 0 to 100
  frictionActive: boolean;
}

interface KineticStatSheetProps {
  stats: StatItem[];
}

export function KineticStatSheet({ stats }: KineticStatSheetProps) {
  return (
    <div className="w-full max-w-sm space-y-6 mt-8 p-6 bg-panel/40 border border-white/5 rounded-lg backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <h3 className="text-neon-gold/50 text-xs font-mono uppercase tracking-[0.3em] border-b border-white/10 pb-2 mb-4">
        Kinetic Output
      </h3>
      
      {stats.map((stat, i) => (
        <div key={i} className="space-y-1 group">
          <div className="flex justify-between items-end mb-1">
            <span 
              className={cn(
                "text-[10px] font-mono uppercase tracking-widest transition-colors",
                stat.frictionActive ? "text-neon-amber font-bold" : "text-foreground/70"
              )}
            >
              {stat.label}
            </span>
            <span 
              className={cn(
                "text-xs font-mono origin-right",
                stat.frictionActive ? "text-neon-amber font-bold" : "text-foreground/50"
              )}
            >
              {stat.value}%
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden flex border border-white/5 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.value}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
              className={cn(
                "h-full relative",
                stat.frictionActive ? "bg-neon-amber" : "bg-neon-gold"
              )}
            >
              <div className="absolute inset-0 bg-white/20 blur-[1px]" />
            </motion.div>
            
            {/* Pulsing glow if friction is active on this line */}
            {stat.frictionActive && (
              <motion.div
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-neon-amber blur-md"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
