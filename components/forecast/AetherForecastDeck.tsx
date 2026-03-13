"use client";

import { useState } from "react";
import { TemporalKey, AetherForecastPayload } from "@/lib/types/forecast";
import { TemporalSelector } from "./TemporalSelector";
import { FrictionWarningBanner } from "./FrictionWarningBanner";
import { ActiveTransitTicker } from "./ActiveTransitTicker";
import { ActivityRecommendationGrid } from "./ActivityRecommendationGrid";
import { motion } from "framer-motion";

interface AetherForecastDeckProps {
  payload: AetherForecastPayload | null; // Null payload signals that data is still resolving
}

export function AetherForecastDeck({ payload }: AetherForecastDeckProps) {
  const [selectedVector, setSelectedVector] = useState<TemporalKey>("today");

  const isLoading = !payload;
  const currentData = payload?.[selectedVector];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center py-8 px-4"
    >
        {/* Header Section */}
        <header className="w-full text-center mb-12 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.25em] text-neon-magenta uppercase drop-shadow-[0_0_15px_rgba(255,0,85,0.4)] mb-2">
            Aether Energy Forecast
          </h2>
          <p className="text-foreground/50 text-xs font-mono tracking-widest uppercase">
            Predictive Analytics Node
          </p>
        </header>

        {/* Temporal Vector Tabbed Navigation */}
        <TemporalSelector 
            selectedVector={selectedVector} 
            onSelect={setSelectedVector} 
        />

        {/* Systemic Drag Alert Banner (Deprecating system_warning down to energyStatus logic, or removing the warning entirely if not defined) */}
        {/* We can re-use FrictionWarningBanner if we detect the word "friction" or "warning" in the energyStatus, or keep it null for now */}
        <FrictionWarningBanner 
            warning={undefined} 
            isLoading={isLoading} 
        />

        {/* Core Telemetry Readout */}
        <ActiveTransitTicker 
            transit={currentData?.transitTitle} 
            energyStatus={currentData?.energyStatus} 
            isLoading={isLoading} 
        />

        {/* Execution Details */}
        <ActivityRecommendationGrid 
            activities={currentData ? [currentData.primaryDirective, currentData.secondaryDirective] : []} 
            isLoading={isLoading} 
        />

    </motion.div>
  );
}
