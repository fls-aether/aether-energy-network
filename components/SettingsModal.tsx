"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore } from "@/lib/store";
import { encryptVault, decryptVault } from "@/lib/crypto";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { telemetry, setGlobalTelemetry } = useOperatorStore();
  
  const [passphrase, setPassphrase] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!passphrase || !telemetry) {
      setErrorMsg("Passphrase and telemetry data required.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);

    try {
      const dataStr = JSON.stringify(telemetry);
      const encryptedPkg = await encryptVault(dataStr, passphrase);
      
      const blob = new Blob([JSON.stringify(encryptedPkg)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "operator_core.aether";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMsg("Data Crystal Extracted Successfully.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Encryption failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportClick = () => {
    if (!passphrase) {
       setErrorMsg("Master Passphrase required to unlock Crystal.");
       return;
    }
    fileInputRef.current?.click();
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
        
        const pkg = JSON.parse(fileContent);
        const decryptedStr = await decryptVault(pkg, passphrase);
        const restoredData = JSON.parse(decryptedStr);
        
        setGlobalTelemetry(restoredData);
        setSuccessMsg("Vault Restored. Telemetry Hydrated.");
        
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err: any) {
         console.error(err);
         setErrorMsg(err.message || "Invalid Data Crystal or Passphrase.");
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
               <h2 className="text-lg font-mono tracking-widest uppercase text-white">Sovereign Data Backup</h2>
               <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                  ✕
               </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Security Banner */}
              <div className="bg-red-950/30 border border-red-500/30 p-4 rounded text-center">
                 <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                   WARNING: This cryptographic lock cannot be bypassed. If you lose your Master Passphrase, your backup crystal is permanently corrupted.
                 </p>
              </div>

               {/* Notifications */}
               {errorMsg && (
                 <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded font-mono text-xs text-center uppercase">
                   {errorMsg}
                 </div>
               )}
               {successMsg && (
                 <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 rounded font-mono text-xs text-center uppercase">
                   {successMsg}
                 </div>
               )}

              {/* Passphrase Input */}
              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Master Passphrase</label>
                 <input 
                   type="password"
                   value={passphrase}
                   onChange={(e) => setPassphrase(e.target.value)}
                   disabled={isProcessing}
                   className="w-full bg-black/50 border border-white/20 text-white px-4 py-3 rounded font-mono text-sm focus:border-neon-gold outline-none transition-colors"
                   placeholder="ENTER SECURE PASSPHRASE"
                 />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                 
                 {/* Export Button */}
                 <button 
                   onClick={handleExport}
                   disabled={isProcessing || !passphrase}
                   className="flex flex-col items-center justify-center p-4 bg-neon-gold/10 border border-neon-gold/30 rounded hover:bg-neon-gold/20 hover:border-neon-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                 >
                    <span className="text-2xl mb-2 group-hover:-translate-y-1 transition-transform">⎈</span>
                    <span className="text-[10px] font-mono text-neon-gold uppercase tracking-widest text-center leading-tight">
                       Extract Encrypted<br/>Data Crystal
                    </span>
                 </button>

                 {/* Import Button */}
                 <button 
                   onClick={handleImportClick}
                   disabled={isProcessing || !passphrase}
                   className="flex flex-col items-center justify-center p-4 bg-neon-purple/10 border border-neon-purple/30 rounded hover:bg-neon-purple/20 hover:border-neon-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                 >
                    <span className="text-2xl mb-2 group-hover:translate-y-1 transition-transform">☥</span>
                    <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest text-center leading-tight">
                       Inject & Restore<br/>Vault
                    </span>
                 </button>

                 {/* Hidden File Input */}
                 <input 
                   type="file" 
                   accept=".aether"
                   ref={fileInputRef}
                   onChange={handleFileUpload}
                   className="hidden"
                 />

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
