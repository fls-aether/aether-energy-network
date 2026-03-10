import { motion, AnimatePresence } from "framer-motion";

interface FrictionWarningBannerProps {
  warning?: string;
  isLoading: boolean;
}

export function FrictionWarningBanner({ warning, isLoading }: FrictionWarningBannerProps) {
  return (
    <AnimatePresence>
      {isLoading ? (
        // Render a subtle loading placeholder if needed, or null. A faint skeleton outline keeps the layout stable.
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="w-full max-w-4xl mx-auto mb-8 h-12 rounded-lg border border-dashed border-white/5 bg-black/10 animate-pulse"
        />
      ) : warning ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl mx-auto mb-8 bg-red-950/40 border border-red-500/50 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
        >
          <div className="flex-shrink-0 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
                System Friction Detected
            </h4>
            <p className="text-red-200/80 text-sm font-mono">{warning}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
