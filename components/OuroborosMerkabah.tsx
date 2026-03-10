"use client";

import { motion } from "framer-motion";

export function OuroborosMerkabah() {
  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-[80%] h-[80%] max-w-[300px] overflow-visible drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
      >
        {/* Complex Overlapping Merkabah (Star Tetrahedron) */}
        <motion.g 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 2, ease: "easeOut" }}
           className="drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
        >
          {/* Upward Gold Tetrahedron (Front) */}
          <motion.path 
            d="M100,25 L165,135 L35,135 Z M100,25 L100,105 L165,135 M100,105 L35,135"
            fill="none"
            stroke="var(--neon-gold)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          {/* Downward Purple Tetrahedron (Back / Interlocking) */}
          <motion.path 
            d="M100,175 L35,65 L165,65 Z M100,175 L100,95 L35,65 M100,95 L165,65"
            fill="none"
            stroke="var(--neon-purple)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Internal Geometric Core Grid */}
          <motion.path
            d="M70,100 L130,100 M100,70 L100,130 M80,80 L120,120 M80,120 L120,80"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2 }}
          />
        </motion.g>

        {/* Glowing Center Core */}
        <motion.circle 
          cx="100" cy="100" r="6"
          fill="var(--neon-amber)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="drop-shadow-[0_0_12px_rgba(255,140,0,1)]"
        />

        {/* Complex Ouroboros Serpent */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
            {/* Outer Snake Body/Scales */}
            <motion.path
                d="M100,10 C150,10 190,50 190,100 C190,150 150,190 100,190 C50,190 10,150 10,100 C10,55 45,15 90,12"
                fill="none"
                stroke="rgba(255,215,0,0.3)"
                strokeWidth="8"
                strokeDasharray="2 4"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.5 }}
            />
            {/* Inner Snake Spine */}
            <motion.path
                d="M100,14 C147,14 186,53 186,100 C186,147 147,186 100,186 C53,186 14,147 14,100 C14,57 47,20 90,16"
                fill="none"
                stroke="var(--neon-gold)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
            />
            {/* Detailed Snake Head */}
            <motion.g
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2, delay: 1 }}
               className="drop-shadow-[0_0_10px_rgba(157,0,255,0.8)]"
            >
               {/* Head Base */}
               <motion.path
                  d="M85,5 L105,10 L115,0 L105,-10 L85,-5 Z"
                  fill="var(--neon-purple)"
                  transform="translate(0, 14) rotate(15, 100, 10)"
               />
               {/* Eye */}
               <motion.circle 
                  cx="98" cy="11" r="1.5" 
                  fill="var(--neon-amber)" 
                  transform="rotate(15, 100, 10)"
               />
               {/* Fangs / Biting action */}
               <motion.path
                  d="M108,12 L112,18 L105,14 Z"
                  fill="white"
               />
            </motion.g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
