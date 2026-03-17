import { useState } from "react";
import { motion } from "framer-motion";
import { useOperatorStore } from "@/lib/store";

interface CharacterGalleryProps {
  operatorClass?: string;
  classDescription?: string;
}

export function CharacterGallery({ operatorClass, classDescription }: CharacterGalleryProps) {
  const { telemetry, setOperatorAvatar, userProfileImage, setUserProfileImage } = useOperatorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const isLoading = !operatorClass;
  const avatar = telemetry?.operatorAvatar;

  const handleGenerateAvatar = async () => {
    if (!operatorClass) return;
    setIsGenerating(true);
    setGenerationError(null);

    // Naive dominant sign extraction - default to sun sign if available, else first HW
    const dominantSign = telemetry?.identitiesMatrix?.tropical?.find(p => p.celestialBody === "Sun")?.sign 
       || "Raw Aether";

    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorClass, dominantSign })
      });

      if (!res.ok) {
         throw new Error("Failed to synthesize insignia.");
      }

      const data = await res.json();
      if (data.avatarBase64) {
         setOperatorAvatar(data.avatarBase64);
      } else {
         throw new Error("Invalid output format.");
      }
    } catch (err) {
      console.error(err);
      setGenerationError(avatar ? "Re-calibration failed. Matrix unstable." : "Synthesis failed. Displaying local Merkaba.");
    } finally {
      setIsGenerating(false);
    }
  };

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
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
             
             {/* Actual Avatar Rendering or Fallback */}
             {avatar ? (
                <>
                  <div 
                     className={`absolute inset-0 opacity-80 mix-blend-screen bg-cover bg-center transition-all duration-700 ${isGenerating ? 'grayscale brightness-50 blur-sm scale-110' : 'group-hover:scale-110'}`}
                     style={{ backgroundImage: `url(${avatar})` }}
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center z-25 bg-black/40 backdrop-blur-sm pointer-events-none">
                      <div className="font-mono text-cyan-400 text-sm animate-pulse tracking-widest uppercase text-center px-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                         Synthesizing sacred geometry...
                      </div>
                    </div>
                  )}
                </>
             ) : (
                <div 
                   className="absolute inset-0 opacity-60 mix-blend-screen"
                   style={{
                      background: `radial-gradient(circle at 50% 30%, rgba(0,255,255,0.2) 0%, transparent 60%)`,
                      backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')`
                   }}
                />
             )}

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
                <p className="text-white/80 font-mono text-xs leading-relaxed mb-6">
                  {classDescription}
                </p>

                {/* Avatar Generation Controls */}
                <div className="mt-4 border-t border-cyan-900/50 pt-4 flex flex-col items-center justify-center relative z-50">
                  {!avatar ? (
                     isGenerating ? (
                        <div className="font-mono text-cyan-400 text-xs animate-pulse tracking-widest uppercase">
                           Synthesizing sacred geometry...
                        </div>
                     ) : (
                        <button 
                           onClick={handleGenerateAvatar}
                           className="w-full py-3 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/50 rounded text-cyan-300 font-mono text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] relative overflow-hidden group/btn"
                        >
                           <span className="relative z-10 font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] animate-pulse">
                               [ Reveal Soul Emblem ]
                           </span>
                           {/* Button hover flare */}
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        </button>
                     )
                  ) : (
                     <div className="flex flex-col items-center gap-2">
                         <button
                            onClick={handleGenerateAvatar}
                            disabled={isGenerating}
                            className={`px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded text-foreground/70 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                         >
                            <svg className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            [ Re-calibrate Insignia ]
                         </button>

                         {/* Set Profile Picture Logic */}
                         {userProfileImage !== avatar ? (
                            <button
                               onClick={() => setUserProfileImage(avatar || null)}
                               className="px-4 py-2 mt-1 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 rounded text-cyan-200 font-mono text-[10px] uppercase tracking-widest transition-all"
                            >
                               [ Set as Profile Picture ]
                            </button>
                         ) : (
                             <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mt-3">
                                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                                Active Profile Image
                             </span>
                         )}
                     </div>
                  )}
                  {generationError && (
                     <div className="text-[10px] font-mono text-red-400 mt-2 text-center">
                        {generationError}
                     </div>
                  )}
                </div>
             </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}
