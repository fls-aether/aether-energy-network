"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface FrictionAlertBannerProps {
  message: string | null;
}

export function FrictionAlertBanner({ message }: FrictionAlertBannerProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-6 border border-neon-amber/50 bg-panel/80 backdrop-blur-md rounded-sm overflow-hidden"
    >
      <div className="border-l-4 border-neon-amber p-4 flex items-center justify-between shadow-[inset_0_0_20px_rgba(255,170,0,0.1)]">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-neon-amber drop-shadow-[0_0_8px_rgba(255,170,0,0.8)]"
          >
            <AlertTriangle size={24} />
          </motion.div>
          <div>
            <h3 className="text-neon-amber text-xs font-bold tracking-widest uppercase mb-1">
              Friction Detected
            </h3>
            <p className="font-mono text-sm text-foreground/90">{message}</p>
          </div>
        </div>
        
        {/* Pulsing warning hex decoration */}
        <motion.div 
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-neon-amber/30 font-mono text-xl mr-2"
        >
          // WARN
        </motion.div>
      </div>
    </motion.div>
  );
}
