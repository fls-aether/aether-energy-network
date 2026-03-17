"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 5 Vibrant "Frequency Colors"
const FREQUENCY_COLORS = [
  "#ffd700", // Neon Gold
  "#9d00ff", // Neon Purple
  "#ff8c00", // Deep Amber
  "#00ffaa", // Neon Green
  "#ffffff", // Core White
];

export function GroundingGeometryCanvas({ onClose }: { onClose: () => void }) {
  const [selectedColor, setSelectedColor] = useState<string>(FREQUENCY_COLORS[0]);
  const [rotationDegree, setRotationDegree] = useState(0);
  
  // A simple 4-frequency inspired grid (using an octagonal/mandala base for geometric complexity)
  // We'll define paths purely by ID so we can track their states
  const totalPaths = 16; 
  const [pathFills, setPathFills] = useState<Record<string, string>>({});

  const isComplete = Object.keys(pathFills).length === totalPaths;

  const handlePathClick = (id: string) => {
    if (isComplete) return; // Prevent changes after completion
    setPathFills(prev => ({
      ...prev,
      [id]: selectedColor
    }));
  };

  // Modifier: Canvas Reload Transition
  if (isComplete) {
    setTimeout(() => {
      setPathFills({});
      setRotationDegree(prev => prev + 45); // Mechanical shift
    }, 2500); // Wait for the glow effect to be appreciated
  }

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-[100] rounded-t-3xl border-t border-white/20 bg-background/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col items-center justify-start min-h-[50vh] max-h-[85vh] overflow-y-auto"
    >
        {/* Header/Close Button */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
            <div>
                <h2 className={`text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-1000 ${isComplete ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-foreground/80'}`}>
                    Tactile Grounding Canvas
                </h2>
                <p className="text-foreground/50 text-[10px] font-mono tracking-widest uppercase mt-1">
                    Phase 5 Alignment
                </p>
            </div>
            <button 
                onClick={onClose}
                className="text-foreground/50 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all font-mono text-xs uppercase tracking-widest py-2 px-4 border border-white/10 rounded-md hover:bg-white/5"
            >
                [ Close ]
            </button>
        </div>

        {/* Completion Alert */}
        <AnimatePresence>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-24 z-20"
                >
                     <div className="px-6 py-2 border border-neon-gold/50 bg-neon-gold/10 text-neon-gold font-mono text-sm tracking-[0.3em] uppercase backdrop-blur-md rounded shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                        [ Grid Stabilized ]
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* The Geometry SVG */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-12 flex-grow">
             {/* Neon Glow beneath the SVG when complete */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0.2, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 bg-white/5 blur-3xl rounded-full pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <svg 
                viewBox="0 0 200 200" 
                className="w-[80%] h-[80%] max-w-[300px] drop-shadow-lg z-10 overflow-visible transition-transform duration-700 ease-in-out"
                style={{ transform: `rotate(${rotationDegree}deg)` }}
            >
                <g stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" pointerEvents="all" fillRule="evenodd">
                    {/* Center Square (4 parts) */}
                    <polygon id="p1" points="100,100 130,70 100,40 70,70" fill={pathFills['p1'] || "transparent"} onClick={() => handlePathClick('p1')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p2" points="100,100 130,130 160,100 130,70" fill={pathFills['p2'] || "transparent"} onClick={() => handlePathClick('p2')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p3" points="100,100 70,130 100,160 130,130" fill={pathFills['p3'] || "transparent"} onClick={() => handlePathClick('p3')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p4" points="100,100 70,70 40,100 70,130" fill={pathFills['p4'] || "transparent"} onClick={() => handlePathClick('p4')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />

                    {/* Outer Star Points (4 parts) */}
                    <polygon id="p5" points="100,40 130,70 100,0 70,70" fill={pathFills['p5'] || "transparent"} onClick={() => handlePathClick('p5')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p6" points="160,100 130,130 200,100 130,70" fill={pathFills['p6'] || "transparent"} onClick={() => handlePathClick('p6')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p7" points="100,160 70,130 100,200 130,130" fill={pathFills['p7'] || "transparent"} onClick={() => handlePathClick('p7')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p8" points="40,100 70,70 0,100 70,130" fill={pathFills['p8'] || "transparent"} onClick={() => handlePathClick('p8')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />

                    {/* Corner Connectors (8 parts) */}
                    <polygon id="p9" points="130,70 160,40 100,0" fill={pathFills['p9'] || "transparent"} onClick={() => handlePathClick('p9')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p10" points="160,100 200,100 160,40" fill={pathFills['p10'] || "transparent"} onClick={() => handlePathClick('p10')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p11" points="130,130 200,100 160,160" fill={pathFills['p11'] || "transparent"} onClick={() => handlePathClick('p11')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p12" points="100,160 160,160 100,200" fill={pathFills['p12'] || "transparent"} onClick={() => handlePathClick('p12')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p13" points="70,130 100,200 40,160" fill={pathFills['p13'] || "transparent"} onClick={() => handlePathClick('p13')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p14" points="40,100 40,160 0,100" fill={pathFills['p14'] || "transparent"} onClick={() => handlePathClick('p14')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p15" points="70,70 0,100 40,40" fill={pathFills['p15'] || "transparent"} onClick={() => handlePathClick('p15')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                    <polygon id="p16" points="100,40 40,40 100,0" fill={pathFills['p16'] || "transparent"} onClick={() => handlePathClick('p16')} className="cursor-pointer transition-colors duration-300 hover:fill-white/10" />
                </g>
                
                {/* Completion Glow Overlay on SVG lines */}
                {isComplete && (
                     <motion.g 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0.4, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        stroke="rgba(255,255,255,0.8)" 
                        strokeWidth="2" 
                        strokeLinejoin="round" 
                        fill="none" 
                        className="pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    >
                         {/* Redrawing the lines to create a glowing structural outline */}
                         <polyline points="100,0 130,70 100,40 70,70 100,0" />
                         <polyline points="200,100 130,130 160,100 130,70 200,100" />
                         <polyline points="100,200 70,130 100,160 130,130 100,200" />
                         <polyline points="0,100 70,70 40,100 70,130 0,100" />
                         
                         <polygon points="100,40 160,100 100,160 40,100" />
                         <polygon points="100,0 200,100 100,200 0,100" />
                    </motion.g>
                )}
            </svg>
        </div>

        {/* Color Palette Array */}
        <div className="flex gap-4 p-4 border border-white/10 rounded-2xl bg-black/20 backdrop-blur-md relative z-10 w-full max-w-sm justify-center">
             {FREQUENCY_COLORS.map(color => (
                <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 ${selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-background' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    style={{ 
                        backgroundColor: color,
                        boxShadow: selectedColor === color ? `0 0 15px ${color}` : 'none'
                    }}
                    aria-label={`Select color ${color}`}
                />
             ))}
        </div>
        
    </motion.div>
  );
}
