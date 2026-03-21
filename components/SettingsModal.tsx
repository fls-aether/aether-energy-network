"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore } from "@/lib/store";
import { signOut } from "next-auth/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { telemetry, operatorDetails, setGlobalTelemetry, setRegistered, resetTelemetry, forceRecalibration } = useOperatorStore();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleForceRecalibration = () => {
    forceRecalibration();
    setSuccessMsg("Local cache purged. Close settings to initialize fresh API telemetry sync.");
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2500);
  };

  const handleExport = async () => {
    if (!telemetry) {
      setErrorMsg("Telemetry data required for export.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);

    try {
      const dataStr = JSON.stringify(telemetry, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Aether-Profile-${operatorDetails?.name?.replace(/\s+/g, '-') || 'Operator'}.aether`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMsg("Profile Data Exported Successfully.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Export failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = async () => {
    resetTelemetry();
    setRegistered(false);
    localStorage.removeItem('aether-energy-storage');
    await signOut({ callbackUrl: "/" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent) throw new Error("Empty file.");

        const restoredData = JSON.parse(fileContent);

        if (!restoredData.integrityPercentage) {
          throw new Error("Invalid Aether profile data detected.");
        }

        setGlobalTelemetry(restoredData);
        setSuccessMsg("Profile Data Imported. Telemetry Hydrated.");

        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Invalid Aether profile data detected.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read file.");
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-mono tracking-widest uppercase text-white">Operator Settings</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
            </div>

            {/* Content Swiper / Scroll Area */}
            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

              {/* Notifications */}
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded font-mono text-xs text-center uppercase">
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 rounded font-mono text-xs text-center uppercase">
                  {successMsg}
                </motion.div>
              )}

              {/* Operator Origin Coordinates */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-neon-cyan uppercase tracking-widest border-l-2 border-neon-cyan pl-2">Origin Coordinates</h3>
                <div className="bg-white/5 border border-white/10 p-4 rounded grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-white/40 font-mono tracking-wider">Operator Name</span>
                    <p className="text-sm text-white font-mono tracking-wider">{operatorDetails?.name || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-white/40 font-mono tracking-wider">Birth Date</span>
                    <p className="text-sm text-white font-mono tracking-wider">{operatorDetails?.date || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-white/40 font-mono tracking-wider">Exact Time</span>
                    <p className="text-sm text-white font-mono tracking-wider">{operatorDetails?.time || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-white/40 font-mono tracking-wider">Birth Location</span>
                    <p className="text-sm text-white font-mono tracking-wider truncate" title={operatorDetails?.location}>{operatorDetails?.location?.split(',')[0] || "Unknown"}</p>
                  </div>
                </div>
              </section>

              {/* Engine Overrides */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-neon-purple uppercase tracking-widest border-l-2 border-neon-purple pl-2">System Architecture</h3>

                <button
                  onClick={handleForceRecalibration}
                  className="w-full p-4 bg-neon-purple/10 border border-neon-purple/30 rounded flex flex-col items-center justify-center hover:bg-neon-purple/20 hover:border-neon-purple/80 transition-all group"
                >
                  <span className="text-sm font-mono text-neon-purple font-bold uppercase tracking-widest text-center group-hover:scale-105 transition-transform mb-1">
                    [ Force Matrix Recalibration ]
                  </span>
                  <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest text-center">
                    Purges local cache and forces API to recalculate charts
                  </span>
                </button>
              </section>

              {/* Data Management */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-neon-gold uppercase tracking-widest border-l-2 border-neon-gold pl-2">Data Operations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleExport}
                    className="p-4 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center hover:bg-white/10 hover:border-neon-gold/50 transition-all group"
                  >
                    <span className="text-xl mb-1 group-hover:-translate-y-1 transition-transform">⎈</span>
                    <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest text-center">Export .aether</span>
                  </button>
                  <button
                    onClick={handleImportClick}
                    className="p-4 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center hover:bg-white/10 hover:border-neon-gold/50 transition-all group"
                  >
                    <span className="text-xl mb-1 group-hover:translate-y-1 transition-transform">☥</span>
                    <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest text-center">Import Backup</span>
                  </button>
                </div>
                <input type="file" accept=".aether" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </section>

              {/* Session Control */}
              <section className="space-y-4 pt-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-950/20 border border-red-500/30 text-red-500 hover:bg-red-900 hover:text-white rounded uppercase font-mono text-xs tracking-[0.3em] font-bold transition-all shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]"
                >
                  [ Logout & Purge Node ]
                </button>
              </section>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}