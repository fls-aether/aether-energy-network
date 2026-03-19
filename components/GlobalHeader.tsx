"use client";

import { useState, useRef } from "react";
import { useOperatorStore } from "@/lib/store";
import { SettingsModal } from "./SettingsModal";
import { GroundingGeometryCanvas } from "./GroundingGeometryCanvas";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalHeader() {
  const { isRegistered, telemetry, userProfileImage } = useOperatorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Only render for authenticated/registered users who have telemetry initialized
  if (!isRegistered || !telemetry) return null;

  return (
    <>
      <div className="fixed top-6 right-6 z-50 pointer-events-auto flex items-center gap-3">
        {/* User Profile Avatar Slot */}
        <div className="w-10 h-10 rounded-full border border-neon-cyan/50 p-0.5 overflow-hidden shadow-[0_0_10px_rgba(0,255,255,0.2)] bg-black/40">
          {userProfileImage ? (
            <img
              src={userProfileImage}
              alt="Operator Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neon-cyan/30 text-xs font-mono">
              OP
            </div>
          )}
        </div>

        {/* Ambient Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`w-10 h-10 rounded-full bg-black/50 border backdrop-blur-md flex items-center justify-center transition-all group ${isPlaying ? 'border-neon-purple/80 text-neon-purple shadow-[0_0_15px_rgba(157,0,255,0.4)]' : 'border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
          title="Toggle Ambient Audio"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        {/* Tactile Canvas Trigger */}
        <button
          onClick={() => setIsCanvasOpen(true)}
          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all group"
          title="Tactile Grounding Canvas"
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">🖌️</span>
        </button>

        {/* Settings Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all group"
          title="Settings"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform duration-500 delay-[0ms]">⚙</span>
        </button>
      </div>

      <audio
        ref={audioRef}
        loop
        autoPlay={false}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      />

      <AnimatePresence>
        {isCanvasOpen && <GroundingGeometryCanvas onClose={() => setIsCanvasOpen(false)} />}
      </AnimatePresence>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
