import { motion } from "framer-motion";

interface ActiveTransitTickerProps {
  transit?: string;
  energyStatus?: string;
  isLoading: boolean;
}

export function ActiveTransitTicker({ transit, energyStatus, isLoading }: ActiveTransitTickerProps) {
  return (
    <div className="w-full flex justify-center mb-8">
      <div className="w-full max-w-2xl bg-black/30 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-neon-gold/50 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-neon-purple/50 rounded-br-2xl" />

        <h3 className="text-foreground/50 text-[10px] uppercase tracking-[0.2em] mb-4 font-mono">
            Active Transit Telemetry
        </h3>

        {isLoading ? (
          <div className="w-full flex justify-center flex-col items-center gap-4">
             {/* Skeleton for Transit */}
             <div className="h-8 w-3/4 bg-white/5 rounded-md animate-pulse" />
             {/* Skeleton for Energy Status */}
             <div className="h-6 w-1/2 bg-white/5 rounded-md animate-pulse" />
          </div>
        ) : (
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             key={transit} // Re-animate when transit changes
             className="text-center"
          >
            <p className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-neon-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mb-2">
                {transit}
            </p>
            <p className="text-sm md:text-base font-mono text-neon-purple tracking-wider">
                Energy Status: <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{energyStatus}</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
