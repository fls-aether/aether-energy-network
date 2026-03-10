"use client";

import { motion } from "framer-motion";

export function CharacterGallery() {
  const characters = [
    {
      id: "succubus-core",
      name: "Succubus Core",
      race: "Demon",
      role: "Infiltrator",
      color: "neon-purple",
      hex: "#9d00ff",
      desc: "High Empathy. Thrives in volatile emotional fields."
    },
    {
      id: "seraph-vanguard",
      name: "Seraph Vanguard",
      race: "Angel",
      role: "Paladin",
      color: "neon-gold",
      hex: "#ffd700",
      desc: "High Logic. Maintains structural integrity under heavy assault."
    },
    {
      id: "sylvan-weaver",
      name: "Sylvan Weaver",
      race: "Elf",
      role: "Technomancer",
      color: "neon-green",
      hex: "#00ffaa",
      desc: "High Stability. Anchors reality loops and mends torn grids."
    }
  ];

  return (
    <div className="w-full mt-12">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            Character Gallery
          </h2>
          <span className="font-mono text-white/50 text-[10px] tracking-widest uppercase border border-white/20 px-2 py-1 rounded bg-white/5">
            [ Mature Archetypes ]
          </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {characters.map((char, i) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className={`group relative h-[450px] rounded-lg overflow-hidden border border-${char.color}/30 bg-black/60 cursor-pointer`}
          >
            {/* Base "Pin-up" Placeholder Image Container */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            
            {/* A placeholder for the actual high-fidelity art */}
            <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                style={{
                   background: `radial-gradient(circle at 50% 30%, ${char.hex}40 0%, transparent 60%)`,
                   backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')`
                }}
            />

            {/* Glowing Border effect on hover */}
            <div 
               className="absolute inset-x-0 bottom-0 h-1 z-20 transition-all duration-500 shadow-[0_-5px_20px_rgba(0,0,0,0)] group-hover:shadow-current"
               style={{ backgroundColor: char.hex, color: char.hex }}
            />

            {/* Typography & Data */}
            <div className="absolute inset-x-0 bottom-0 p-6 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
               <div className="flex items-center gap-2 mb-2">
                 <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-${char.color}/50 text-${char.color} bg-${char.color}/10 rounded-sm backdrop-blur-md`}>
                    {char.race}
                 </span>
                 <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">
                    // {char.role}
                 </span>
               </div>
               <h3 className={`text-2xl font-bold tracking-wider text-white mb-2 drop-shadow-[0_0_8px_${char.hex}80]`}>
                 {char.name}
               </h3>
               <p className="text-white/70 font-mono text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                 {char.desc}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
