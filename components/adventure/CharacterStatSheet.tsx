"use client";

import { motion } from "framer-motion";

export interface CharacterStat {
  id: string;
  label: string;
  value: number; // 0-100
  colorClass: string;
  strokeColor: string;
}

interface CharacterStatSheetProps {
  stats: CharacterStat[] | null;
}

export function CharacterStatSheet({ stats }: CharacterStatSheetProps) {
  // Config for the SVG Rings
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-2xl" />

      <div className="text-center border-b border-white/10 pb-4 mb-8 flex flex-col items-center">
        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-white/50 mb-2">
          Biometric Integrity
        </h2>
        <p className="text-[10px] font-mono tracking-widest text-foreground/50 uppercase max-w-xl">
          Real-time synthesis of your elemental and numerical stability derived from your active transit data.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats ? (
          stats.map((stat, i) => {
            const dashoffset = circumference - (stat.value / 100) * circumference;
            return (
              <div key={stat.id} className="flex flex-col items-center justify-center relative">
                 <div className="relative w-24 h-24 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 delay-[0ms]">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="stroke-white/10 fill-transparent"
                        strokeWidth="4"
                      />
                      {/* Progress Ring */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="fill-transparent transition-all duration-1000 ease-out"
                        strokeWidth="4"
                        stroke={stat.strokeColor}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: dashoffset }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        style={{ strokeLinecap: "round" }}
                      />
                    </svg>
                    
                    {/* Render the actual number inside the ring */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + (i * 0.2) }}
                        className={`absolute font-mono text-xl font-bold ${stat.colorClass} drop-shadow-[0_0_8px_${stat.strokeColor}]`}
                    >
                        {stat.value}
                    </motion.div>
                 </div>
                 <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70">
                    {stat.label}
                 </span>
              </div>
            );
          })
        ) : (
          // Skeleton Loaders
          [1, 2, 3, 4].map((i) => (
             <div key={i} className="flex flex-col items-center justify-center relative">
                 <div className="w-24 h-24 rounded-full border-4 border-white/5 bg-white/5 animate-pulse mb-4" />
                 <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
             </div>
          ))
        )}
      </div>
    </div>
  );
}
