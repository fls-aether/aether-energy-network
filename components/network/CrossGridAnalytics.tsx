import { motion, AnimatePresence } from "framer-motion";
import { NetworkConnection, SynastryData } from "@/lib/types/network";

interface CrossGridAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  // Payload will be injected here when real data is available. 
  // For now, we accept null to trigger strictly skeleton loaders.
  nodePayload: { connection: NetworkConnection; synastry: SynastryData } | null;
}

export function CrossGridAnalytics({ isOpen, onClose, nodePayload }: CrossGridAnalyticsProps) {
  const isLoading = !nodePayload;

  // Determine neon accent color based on category if data is present
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Social': return 'border-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] text-neon-gold';
      case 'Family': return 'border-neon-amber shadow-[0_0_15px_rgba(255,170,0,0.4)] text-neon-amber';
      case 'Work': return 'border-neon-green shadow-[0_0_15px_rgba(0,255,170,0.4)] text-neon-green';
      case 'Romantic': return 'border-neon-purple shadow-[0_0_15px_rgba(157,0,255,0.4)] text-neon-purple';
      default: return 'border-white/20 text-white';
    }
  };

  const accentClass = isLoading ? 'border-white/10' : getCategoryColor(nodePayload?.connection.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-Over Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-background/95 border-l backdrop-blur-xl z-50 p-6 md:p-8 flex flex-col overflow-y-auto ${accentClass}`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-md mb-1">
                  Cross-Grid Synastry
                </h2>
                <p className="font-mono text-[10px] text-foreground/50 tracking-widest uppercase">
                  Node Authentication Required
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-foreground/50 hover:text-white transition-colors p-2 -mr-2"
                aria-label="Close analytics modal"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex flex-col space-y-8">
              {isLoading ? (
                  // Deep Skeleton Structure (Zero Hardcode)
                  <div className="animate-pulse space-y-8 w-full">
                     {/* Identity Skeleton */}
                     <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                         <div className="space-y-2 flex-1">
                             <div className="h-6 bg-white/5 rounded w-3/4" />
                             <div className="h-4 bg-white/5 rounded w-1/2" />
                         </div>
                     </div>
                     
                     <hr className="border-white/5" />
                     
                     {/* Analytics Blocks Skeleton */}
                     <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
                     
                     <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                         <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                     </div>
                     
                     <div className="h-32 bg-white/5 rounded-xl border border-white/10 w-full mt-4" />
                     <div className="h-16 bg-white/5 rounded-xl w-full mt-4" />
                  </div>
              ) : (
                  // Interpolated Content Structure (when payload arrives)
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="flex items-center gap-4">
                         <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono text-xl ${accentClass}`}>
                            {nodePayload?.connection.name.charAt(0)}
                         </div>
                         <div>
                             <h3 className="text-lg font-bold tracking-widest uppercase text-white">
                                 {nodePayload?.connection.name}
                             </h3>
                             <p className={`font-mono text-xs tracking-widest uppercase ${accentClass.split(' ')[2]}`}>
                                 [{nodePayload?.connection.category} Node]
                             </p>
                         </div>
                     </div>
                     
                     <hr className="border-white/10" />
                     
                     <div>
                         <h4 className="font-mono text-xs text-foreground/50 tracking-widest uppercase mb-4">
                             Resonance Metrics
                         </h4>
                         <div className="grid grid-cols-2 gap-4 text-center">
                             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                                 <span className="text-2xl font-bold text-neon-gold">{nodePayload?.synastry.resonance}%</span>
                                 <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">Alignment</span>
                             </div>
                             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                                 <span className="text-2xl font-bold text-red-400">{nodePayload?.synastry.frictionPoints}</span>
                                 <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">Friction Vectors</span>
                             </div>
                         </div>
                     </div>
                  </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-foreground/30">
                    Aether Energy Network // Phase 8
                </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
