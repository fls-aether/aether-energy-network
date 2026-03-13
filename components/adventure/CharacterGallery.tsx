"use client";

import { motion } from "framer-motion";

interface CharacterGalleryProps {
  operatorClass?: string;
  classDescription?: string;
}

export function CharacterGallery({ operatorClass, classDescription }: CharacterGalleryProps) {
  const isLoading = !operatorClass;

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
        {isLoading ? (
           // Sleek Skeleton Fallback
           <div className="group relative h-[450px] rounded-lg overflow-hidden border border-white/5 bg-black/40 animate-pulse">
              <div className="absolute inset-x-0 bottom-0 p-6">
                 <div className="h-4 w-1/4 bg-white/10 rounded mb-4" />
                 <div className="h-8 w-3/4 bg-white/10 rounded mb-4" />
                 <div className="h-12 w-full bg-white/10 rounded" />
              </div>
           </div>
        ) : (
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className={`group relative h-[450px] rounded-lg overflow-hidden border border-neon-cyan/50 bg-black/60 shadow-[0_0_30px_rgba(0,255,255,0.1)]`}
           >
             {/* Base "Pin-up" Placeholder Image Container */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
             
             {/* A placeholder for the actual high-fidelity art */}
             <div 
                 className="absolute inset-0 opacity-60 mix-blend-screen"
                 style={{
                    background: `radial-gradient(circle at 50% 30%, rgba(0,255,255,0.2) 0%, transparent 60%)`,
                    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')`
                 }}
             />

             {/* Glowing Border effect on hover */}
             <div 
                className="absolute inset-x-0 bottom-0 h-1 z-20 transition-all duration-500 bg-cyan-400 shadow-[0_-5px_20px_rgba(0,255,255,0.5)]"
             />

             {/* Typography & Data */}
             <div className="absolute inset-x-0 bottom-0 p-6 z-30">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase border border-cyan-400/50 text-cyan-200 bg-cyan-900/30 rounded-sm backdrop-blur-md`}>
                     Active Operator
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400/50">
                     // Synced
                  </span>
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold tracking-wider text-white mb-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]`}>
                  {operatorClass}
                </h3>
                <p className="text-white/80 font-mono text-xs leading-relaxed">
                  {classDescription}
                </p>
             </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}
