"use client";

import { AetherForecastDeck } from "@/components/forecast/AetherForecastDeck";
import { useOperatorStore } from "@/lib/store";

export default function ForecastPage() {
  const { telemetry } = useOperatorStore();
  
  // If no temporal forecast exists yet (e.g. user navigated here before data loaded), we pass null to trigger skeleton state
  const payload = telemetry?.temporalForecast || null;

  return (
    <div className="min-h-screen w-full bg-background pt-12 pb-40 px-4 md:px-8 relative overflow-hidden flex justify-center">
       {/* Ambient Backing layered to match aesthetic */}
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-neon-gold/20 via-neon-purple/10 to-transparent blur-[2px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[20rem] bg-neon-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* 
        Payload starts as null triggering skeleton UI. 
        Resolves to valid AetherForecastPayload upon API response.
      */}
      <AetherForecastDeck payload={payload} />
    </div>
  );
}
