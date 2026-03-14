import { motion } from "framer-motion";

interface ActivityRecommendationGridProps {
  activities?: string[];
  isLoading: boolean;
}

export function ActivityRecommendationGrid({ activities, isLoading }: ActivityRecommendationGridProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
        <h3 className="text-foreground/50 text-[10px] uppercase tracking-[0.2em] mb-6 font-mono text-center md:text-left">
            Execution Directives
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
                // Render Skeleton Array
                Array.from({ length: 6 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="h-24 bg-white/5 rounded-xl border border-white/10 animate-pulse relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
                    </div>
                ))
            ) : (
                // Render Actual Activities
                activities?.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-neon-gold/50 hover:bg-white/5 transition-all duration-300 group"
                    >
                        <p className="text-sm font-mono tracking-wide leading-relaxed text-foreground/90">
                            {activity}
                        </p>
                    </motion.div>
                ))
            )}
        </div>
    </div>
  );
}
