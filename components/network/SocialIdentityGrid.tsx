"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ConnectionCategory, NetworkConnection, NetworkNodePayload } from "@/lib/types/network";
import { CrossGridAnalytics } from "./CrossGridAnalytics";

interface SocialIdentityGridProps {
  connections: NetworkConnection[] | null; // Null triggers skeletons
  rawNodes?: NetworkNodePayload[] | null;  // Used to extract synastry when tapped
}

const CATEGORIES: ConnectionCategory[] = ['Social', 'Family', 'Work', 'Romantic'];

export function SocialIdentityGrid({ connections, rawNodes }: SocialIdentityGridProps) {
  const [filter, setFilter] = useState<ConnectionCategory | 'All'>('All');
  const [syncCode, setSyncCode] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const isLoading = !connections;
  
  // Filter logic (safe checking if array exists)
  const filteredConnections = connections?.filter(
      (conn) => filter === 'All' || conn.category === filter
  );

  const getBorderColor = (category: ConnectionCategory) => {
    switch (category) {
      case 'Social': return 'hover:border-neon-cyan/80 border-neon-cyan/20';
      case 'Family': return 'hover:border-neon-amber/80 border-neon-amber/20';
      case 'Work': return 'hover:border-neon-green/80 border-neon-green/20';
      case 'Romantic': return 'hover:border-neon-magenta/80 border-neon-magenta/20';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center py-8 px-4 h-full relative">
        <header className="w-full text-center mb-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-2">
            Social Identity Matrix
          </h2>
          <p className="text-foreground/50 text-xs font-mono tracking-widest uppercase">
            Aether Network Connectivity
          </p>
        </header>

        {/* Sync-Code Manual Link Interface */}
        <div className="w-full max-w-md mb-8">
             <div className="relative flex items-center">
                <input
                    type="password"
                    value={syncCode}
                    onChange={(e) => setSyncCode(e.target.value)}
                    placeholder="Enter Origin Sync-Code..."
                    className="w-full bg-black/40 border border-white/20 rounded-l-full py-3 px-6 text-sm font-mono tracking-widest text-white placeholder-white/30 focus:outline-none focus:border-neon-gold transition-colors"
                />
                <button className="bg-neon-gold/20 border border-l-0 border-neon-gold/50 text-neon-gold hover:bg-neon-gold hover:text-black transition-all font-mono font-bold tracking-widest uppercase text-xs px-6 py-3 rounded-r-full h-full flex items-center justify-center">
                    Link
                </button>
             </div>
        </div>

        {/* Classification Filtering */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
                onClick={() => setFilter('All')}
                className={`px-4 py-1 rounded-full border text-xs font-mono uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-white/20 text-white/50 hover:border-white/50'}`}
            >
                All
            </button>
            {CATEGORIES.map(cat => (
                 <button
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={`px-4 py-1 rounded-full border text-xs font-mono uppercase tracking-widest transition-all ${filter === cat ? 'bg-white/10 text-white border-white/80' : 'border-white/20 text-white/50 hover:border-white/50'}`}
             >
                 {cat}
             </button>
            ))}
        </div>

        {/* Network Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {isLoading ? (
                // Shimmering Skeleton Cards (Zero Hardcode Mock Data)
                Array.from({ length: 8 }).map((_, i) => (
                    <div 
                        key={`skel-${i}`}
                        onClick={() => setSelectedNodeId(`skel-${i}`)}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors animate-pulse relative overflow-hidden group"
                    >
                         <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex-shrink-0" />
                         <div className="flex-1 space-y-3">
                             <div className="h-4 bg-white/10 rounded w-3/4" />
                             <div className="h-3 bg-white/5 rounded w-1/2" />
                         </div>
                         <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
                    </div>
                ))
            ) : (
                // Actual connection rendering (When Hydrated)
                filteredConnections?.map((conn) => (
                    <motion.div
                        key={conn.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedNodeId(conn.id)}
                        className={`bg-black/40 border rounded-2xl p-6 flex flex-col justify-center cursor-pointer transition-all duration-300 shadow-lg backdrop-blur-sm ${getBorderColor(conn.category)}`}
                    >
                        <h3 className="font-bold text-lg tracking-wide text-white mb-1 truncate">{conn.name}</h3>
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">{conn.category} Node</p>
                    </motion.div>
                ))
            )}
        </div>

        {/* Tapping a node mounts the analytics modal, passing the full synced payload */}
        <CrossGridAnalytics 
           isOpen={!!selectedNodeId} 
           onClose={() => setSelectedNodeId(null)}
           nodePayload={selectedNodeId ? rawNodes?.find(n => n.connection.id === selectedNodeId) || null : null} 
        />
    </div>
  );
}
