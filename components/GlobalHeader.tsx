"use client";

import { useState } from "react";
import { useOperatorStore } from "@/lib/store";
import { SettingsModal } from "./SettingsModal";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalHeader() {
  const { isRegistered, telemetry } = useOperatorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only render for authenticated/registered users who have telemetry initialized
  if (!isRegistered || !telemetry) return null;

  return (
    <>
      <div className="fixed top-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all group"
          title="Sovereign Data Backup"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform duration-500 delay-[0ms]">⚙</span>
        </button>
      </div>

      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
