import { TemporalKey } from "@/lib/types/forecast";
import { motion } from "framer-motion";

interface TemporalSelectorProps {
  selectedVector: TemporalKey;
  onSelect: (vector: TemporalKey) => void;
}

export function TemporalSelector({ selectedVector, onSelect }: TemporalSelectorProps) {
  const vectors: { key: TemporalKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "this_week", label: "This Week" },
    { key: "this_month", label: "This Month" },
    { key: "this_year", label: "This Year" },
  ];

  return (
    <div className="flex justify-center w-full mb-8">
      <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {vectors.map(({ key, label }) => {
          const isActive = selectedVector === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`relative px-6 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300
                ${isActive ? 'text-cyan-400 font-bold' : 'text-foreground/70 hover:text-white'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="temporalActiveTab"
                  className="absolute inset-0 bg-neon-gold rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
