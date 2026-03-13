"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOperatorStore } from "@/lib/store";
import { useGhostProtocol } from "@/hooks/useGhostProtocol";

export default function ConnectionsPage() {
  const { syncCode, confirmedConnections } = useOperatorStore();
  const displayCode = syncCode || "AWT-XXXXXX-XXX";

  // WebRTC Hook
  const { 
    status, messages, errorMsg, 
    generateOffer, acceptOffer, finalizeConnection, 
    sendMessage, disconnect 
  } = useGhostProtocol();

  // Handshake UI States
  const [localOffer, setLocalOffer] = useState("");
  const [remoteAnswerInput, setRemoteAnswerInput] = useState("");
  
  const [remoteOfferInput, setRemoteOfferInput] = useState("");
  const [localAnswer, setLocalAnswer] = useState("");

  const [handshakeError, setHandshakeError] = useState<string | null>(null);

  // Chat Terminal State
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handshake Handlers (With try/catch constraints)
  const handleGenerateOffer = async () => {
    setHandshakeError(null);
    const token = await generateOffer();
    if (token) setLocalOffer(token);
  };

  const handleFinalizeInitiator = async () => {
    setHandshakeError(null);
    if (!remoteAnswerInput) return;
    try {
      await finalizeConnection(remoteAnswerInput);
    } catch (e: any) {
      setHandshakeError(e.message || "Invalid Quantum Handshake string detected.");
    }
  };

  const handleAcceptOffer = async () => {
    setHandshakeError(null);
    if (!remoteOfferInput) return;
    try {
      const token = await acceptOffer(remoteOfferInput);
      if (token) setLocalAnswer(token);
    } catch (e: any) {
      setHandshakeError("Invalid Quantum Handshake string detected.");
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
    setChatInput("");
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-12 font-mono">
      
      {/* Header Context */}
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-white">Grid Connections</h1>
        <p className="text-foreground/50 text-xs tracking-widest uppercase mt-2">Zero-Trust Mutual Authentication Layer</p>
      </header>

      {/* Security Banner */}
      {status === 'connected' && (
        <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
           <div>
             <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               Ghost Protocol Active
             </h3>
             <p className="text-red-300/70 text-xs font-mono mt-1">Direct P2P Tunnel. Zero server retention.</p>
           </div>
           <button 
             onClick={disconnect}
             className="px-6 py-2 bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-red-100 uppercase tracking-widest text-xs font-bold transition-all rounded"
           >
             [ Sever & Purge Link ]
           </button>
        </div>
      )}

      {errorMsg && (
        <div className="text-red-400 border border-red-500/30 bg-red-950/20 p-4 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
           System Alert: {errorMsg}
        </div>
      )}
      {handshakeError && (
        <div className="text-neon-amber border border-neon-amber/30 bg-orange-950/20 p-4 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
           Handshake Error: {handshakeError}
        </div>
      )}

      {/* Main UI Area */}
      {status === 'connected' ? (
        
        // --- TERMINAL CHAT INTERFACE ---
        <section className="bg-black/60 border border-cyan-900/50 rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="bg-cyan-950/30 border-b border-cyan-900/50 p-3 flex justify-between items-center">
             <span className="text-cyan-500 text-xs font-mono uppercase tracking-[0.2em]">Encrypted Terminal</span>
             <span className="text-cyan-500/50 text-[10px] font-mono">P2P TUNNEL // WEBRTC</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
             {messages.length === 0 && (
               <div className="text-center text-cyan-800 text-xs uppercase mt-10">Uplink established. Awaiting input...</div>
             )}
             {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-cyan-600 uppercase">{msg.timestamp}</span>
                    <span className={`text-[10px] font-bold tracking-wider ${msg.sender === 'me' ? 'text-neon-gold' : 'text-neon-purple'}`}>
                      {msg.sender === 'me' ? 'LOCAL' : 'REMOTE'}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded max-w-[80%] break-words text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-cyan-950/40 border border-cyan-800 text-cyan-100' 
                      : 'bg-purple-950/40 border border-purple-800 text-purple-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 border-t border-cyan-900/50 bg-black/80 flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Inject payload..."
              className="flex-1 bg-black border border-cyan-900 text-cyan-100 px-4 py-2 text-sm font-mono outline-none focus:border-cyan-400 transition-colors"
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim()}
              className="bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-700 text-cyan-300 px-6 font-mono text-xs uppercase tracking-widest disabled:opacity-50 transition-colors"
            >
              Transmit
            </button>
          </form>
        </section>

      ) : (
        
        // --- QUANTUM HANDSHAKE INTERFACE ---
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Initiator Block */}
          <div className="bg-panel/40 border border-neon-gold/20 rounded-lg p-8 backdrop-blur-md relative group flex flex-col">
              <div className="absolute inset-0 bg-neon-gold/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              <h3 className="text-xs text-neon-gold tracking-[0.2em] font-bold uppercase mb-6 text-center">Step 1: Initiate Tunnel</h3>
              
              {!localOffer ? (
                <button 
                   onClick={handleGenerateOffer}
                   disabled={status !== 'idle'}
                   className="w-full py-4 border border-neon-gold/50 bg-black/40 text-neon-gold uppercase text-xs tracking-[0.2em] shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:bg-neon-gold/20 transition-all disabled:opacity-50 mt-4"
                >
                  {status === 'offering' ? 'Generating Keys...' : '[ Generate Ghost Link ]'}
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                   <div className="text-[10px] text-foreground/60 uppercase">Share this key with receiver:</div>
                   <div className="flex items-center gap-2">
                     <input 
                       readOnly 
                       value={localOffer} 
                       className="flex-1 bg-black/50 border border-neon-gold/30 text-neon-gold/70 px-3 py-2 text-xs font-mono outline-none truncate"
                     />
                     <button 
                       onClick={() => navigator.clipboard.writeText(localOffer)}
                       className="px-3 py-2 bg-neon-gold/20 border border-neon-gold/50 text-neon-gold text-[10px] uppercase hover:bg-neon-gold hover:text-black transition-colors"
                     >
                       Copy
                     </button>
                   </div>
                   
                   <div className="border-t border-white/10 my-2" />
                   
                   <div className="text-[10px] text-foreground/60 uppercase">Paste their Answer Key here:</div>
                   <input 
                     type="text"
                     value={remoteAnswerInput}
                     onChange={(e) => setRemoteAnswerInput(e.target.value)}
                     className="w-full bg-black/50 border border-neon-gold/30 text-white px-3 py-2 text-xs font-mono outline-none focus:border-neon-gold"
                     placeholder="PASTE BASE64 STRING..."
                   />
                   <button 
                     onClick={handleFinalizeInitiator}
                     disabled={!remoteAnswerInput}
                     className="w-full py-3 bg-neon-gold/20 border border-neon-gold text-neon-gold uppercase text-xs hover:bg-neon-gold hover:text-black transition-colors disabled:opacity-50"
                   >
                     Initialize Handshake
                   </button>
                </div>
              )}
          </div>

          {/* Receiver Block */}
          <div className="bg-panel/40 border border-neon-purple/20 rounded-lg p-8 backdrop-blur-md relative group flex flex-col">
              <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              <h3 className="text-xs text-neon-purple tracking-[0.2em] font-bold uppercase mb-6 text-center">Step 2: Receive Tunnel</h3>
              
              {!localAnswer ? (
                <div className="flex flex-col gap-4 mt-4">
                  <div className="text-[10px] text-foreground/60 uppercase">Paste Initiator's Key here:</div>
                  <input 
                    type="text"
                    value={remoteOfferInput}
                    onChange={(e) => setRemoteOfferInput(e.target.value)}
                    className="w-full bg-black/50 border border-neon-purple/30 text-white px-3 py-2 text-xs font-mono outline-none focus:border-neon-purple"
                    placeholder="PASTE BASE64 STRING..."
                  />
                  <button 
                    onClick={handleAcceptOffer}
                    disabled={!remoteOfferInput || status !== 'idle'}
                    className="w-full py-3 bg-neon-purple/20 border border-neon-purple text-neon-purple uppercase text-xs hover:bg-neon-purple hover:text-white transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(188,19,254,0.1)]"
                  >
                    {status === 'connecting' ? 'Resolving Handshake...' : '[ Generate Answer Link ]'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-4">
                  <div className="text-[10px] text-neon-purple uppercase p-2 border border-neon-purple/30 bg-neon-purple/10 text-center">
                    Acceptance Sequence Complete
                  </div>
                  <div className="text-[10px] text-foreground/60 uppercase">Return this Answer Key to Initiator:</div>
                  <div className="flex items-center gap-2">
                     <input 
                       readOnly 
                       value={localAnswer} 
                       className="flex-1 bg-black/50 border border-neon-purple/30 text-neon-purple/70 px-3 py-2 text-xs font-mono outline-none truncate"
                     />
                     <button 
                       onClick={() => navigator.clipboard.writeText(localAnswer)}
                       className="px-3 py-2 bg-neon-purple/20 border border-neon-purple/50 text-neon-purple text-[10px] uppercase hover:bg-neon-purple hover:text-white transition-colors"
                     >
                       Copy
                     </button>
                  </div>
                  <div className="mt-4 text-[10px] text-center text-foreground/40 italic">Awaiting final Initiator confirmation to open tunnel...</div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* Confirmed Connections Grid */}
      <section className="mt-8 space-y-6">
         <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-2 h-2 rounded-full bg-neon-amber shadow-[0_0_8px_rgba(255,140,0,0.8)]" />
            <h2 className="text-sm text-white uppercase tracking-[0.2em]">Confirmed Links</h2>
            <span className="ml-auto text-xs text-foreground/50 tracking-widest uppercase">Nodes: {confirmedConnections.length}</span>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Active Connections */}
            {confirmedConnections.map((conn) => (
              <div 
                key={conn.id}
                className="bg-panel/40 border border-neon-gold/30 rounded-lg aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-neon-gold transition-colors"
                title={`Synced: ${new Date(conn.timestamp).toLocaleDateString()}`}
              >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-10 h-10 rounded-full border border-neon-gold/50 flex items-center justify-center mb-3 bg-black/40 shadow-inner group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-shadow">
                    <span className="text-neon-gold text-lg">⌬</span>
                  </div>
                  <span className="text-[10px] text-white font-mono tracking-widest uppercase text-center leading-tight">
                    {conn.name}
                  </span>
              </div>
            ))}

            {/* Locked Placeholders */}
            {[...Array(Math.max(0, 10 - confirmedConnections.length))].map((_, i) => (
              <div 
                key={`locked-${i}`} 
                className="bg-black/30 border border-white/5 rounded-lg aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden group"
              >
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  
                  <span className="text-foreground/20 group-hover:text-foreground/40 transition-colors text-2xl mb-2">⎈</span>
                  <span className="text-[9px] text-foreground/20 font-mono tracking-widest uppercase -mt-1 group-hover:text-foreground/40 transition-colors">Locked</span>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
}
