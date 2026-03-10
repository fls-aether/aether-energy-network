"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SystemIntegrityMeterProps {
  percentage: number;
}

export function SystemIntegrityMeter({ percentage }: SystemIntegrityMeterProps) {
  const [currentDisplay, setCurrentDisplay] = useState(0);

  useEffect(() => {
    // Simple counter animation
    const duration = 2000;
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        clearInterval(timer);
        setCurrentDisplay(percentage);
      } else {
        setCurrentDisplay(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentDisplay / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-48 h-48">
      {/* Background glow based on integrity levels */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10"
        style={{ backgroundColor: percentage > 50 ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}
      />
      
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={percentage > 50 ? "#00f0ff" : "#ffaa00"}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono tracking-tighter" style={{ color: percentage > 50 ? "#00f0ff" : "#ffaa00" }}>
          {currentDisplay}%
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">
          Integrity
        </span>
      </div>
    </div>
  );
}
