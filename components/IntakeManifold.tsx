"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { WireframeTorus } from "./WireframeTorus";
import { useOperatorStore } from "@/lib/store";
import { calculateStats } from "@/lib/calculations";
import { generateSyncCode } from "@/lib/utils";
import { useSession, signIn } from "next-auth/react";
import debounce from 'lodash.debounce';

interface IntakeManifoldProps {
  onComplete: () => void;
}

export function IntakeManifold({ onComplete }: IntakeManifoldProps) {
  const { data: session } = useSession();
  const [vibrationalKey, setVibrationalKey] = useState("");
  const [emailState, setEmailState] = useState(""); // Kept hidden/in background just in case
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");
  const [timePeriod, setTimePeriod] = useState("AM");
  const [spatialCoords, setSpatialCoords] = useState("");
  const [intensity, setIntensity] = useState(0);

  // New states for Phase 11
  const [showToast, setShowToast] = useState(false);
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);
  const [placesPredictions, setPlacesPredictions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setAgeData, setStats, setSyncCode, setOperatorDetails } = useOperatorStore();

  // Auto-populate from NextAuth Session
  useEffect(() => {
    if (session?.user?.name && !vibrationalKey) {
      setVibrationalKey(session.user.name);
      if (session.user.email) setEmailState(session.user.email);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [session, vibrationalKey]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlacesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const fetchPlaces = async (input: string) => {
    if (!input || input.trim().length < 2) {
      setPlacesPredictions([]);
      setShowPlacesDropdown(false);
      return;
    }
    
    try {
      // Using an API route to safely hide the key and bypass pure CORS blocks on Google map's direct REST API
      const response = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
      if (response.ok) {
        const data = await response.json();
        // Assuming data is an array of formatted description strings
        setPlacesPredictions(data.predictions || []);
        setShowPlacesDropdown(data.predictions && data.predictions.length > 0);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // Debounced version of fetchPlaces
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 300), []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[\s-]/g, '/').replace(/[^0-9/]/g, '');
    if (val.length > 2 && val[2] !== '/') val = val.slice(0, 2) + '/' + val.slice(2);
    if (val.length > 5 && val[5] !== '/') val = val.slice(0, 5) + '/' + val.slice(5);
    setTempDate(val.substring(0, 10));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9:]/g, '');
    
    // Remove extra colons (keep only the first one)
    const colonIndex = val.indexOf(':');
    if (colonIndex !== -1) {
        val = val.substring(0, colonIndex + 1) + val.substring(colonIndex + 1).replace(/:/g, '');
    }

    // Auto insert colon after 2 digits if typing forward
    if (val.length === 2 && !val.includes(':') && e.target.value.length > tempTime.length) {
        val = val + ':';
    } else if (val.length > 2 && !val.includes(':')) {
        val = val.slice(0, 2) + ':' + val.slice(2);
    }

    // Auto convert > 12 to PM
    if (val.length >= 2) {
      let hours = parseInt(val.slice(0, 2), 10);
      if (hours > 12) {
        hours = hours - 12;
        setTimePeriod("PM");
        val = hours.toString().padStart(2, '0') + val.slice(2);
      }
    }

    setTempTime(val.substring(0, 5)); // Support up to HH:MM

    if (val.length >= 5 && tempTime.length < 5) {
      document.getElementById('timePeriod')?.focus();
    }
  };

  const handleSpatialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpatialCoords(value);
    debouncedFetchPlaces(value);
  };

  const selectPlace = (place: string) => {
    setSpatialCoords(place);
    setShowPlacesDropdown(false);
  };

  // Calculate generic intensity based on input length
  useEffect(() => {
    const totalLength = vibrationalKey.length + tempDate.length + tempTime.length + timePeriod.length + spatialCoords.length;
    // Cap intensity multiplier at 1
    const newIntensity = Math.min(totalLength / 50, 1);
    setIntensity(newIntensity);
  }, [vibrationalKey, tempDate, tempTime, timePeriod, spatialCoords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vibrationalKey && tempDate && tempTime && spatialCoords) {
      // Calculate age based on tempDate (MM/DD/YYYY)
      const parts = tempDate.split('/');
      if (parts.length === 3) {
        const birthDate = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--; // Hasn't had birthday yet this year
        }
        
        const isAdult = age >= 18;
        setAgeData(age, isAdult);
      }
      
      const fullTime = `${tempTime} ${timePeriod}`;

      // Phase 28: Store raw operator details for Gemini AI API
      setOperatorDetails({
        name: vibrationalKey,
        date: tempDate,
        time: fullTime,
        location: spatialCoords
      });

      // Phase 15 SPA Biometric Calculation
      const derivedStats = calculateStats(vibrationalKey, tempDate, fullTime, spatialCoords);
      setStats(derivedStats);

      // Phase 26 Sync-Code Generation
      const generatedCode = generateSyncCode(vibrationalKey, tempDate, spatialCoords);
      setSyncCode(generatedCode);

      onComplete();
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row items-center justify-center bg-background overflow-hidden overflow-y-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-neon-gold text-neon-gold px-6 py-3 shadow-[0_0_20px_rgba(255,215,0,0.4)] backdrop-blur-md rounded-full font-mono text-xs tracking-widest uppercase flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-neon-gold animate-pulse" />
            Authorization Successful // Key Injected
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Merkaba Display */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen relative z-10 flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <WireframeTorus intensity={intensity} />
        </Canvas>
        
        {/* Glow backdrop behind canvas */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-300 pointer-events-none"
          style={{ 
            backgroundColor: 'var(--accent-gold)',
            opacity: 0.1 + (intensity * 0.4)
          }}
        />
      </div>

      {/* Intake Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} // Added a slight delay for the splash fade-in
        className="w-full md:w-1/2 p-8 md:p-16 z-20 flex flex-col justify-center max-w-lg"
      >
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-neon-gold uppercase mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Identity Core Calibration
          </h1>
          <p className="text-foreground/70 tracking-widest text-sm uppercase">
            Awaiting Sovereign Coordinates //
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="vibrationalKey" className="block text-xs font-mono text-neon-purple uppercase tracking-widest">
              Vibrational Key
            </label>
            <input
              id="vibrationalKey"
              name="vibrationalKey"
              type="text"
              value={vibrationalKey}
              onChange={(e) => setVibrationalKey(e.target.value)}
              className="w-full bg-panel border-b-2 border-neon-purple/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-purple transition-colors"
              placeholder="Full Legal Name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tempDate" className="block text-xs font-mono text-neon-amber uppercase tracking-widest">
              Temporal Inception (Date)
            </label>
            <input
              id="tempDate"
              name="tempDate"
              type="text" // Kept as text per user format request, but could be 'date'
              value={tempDate}
              onChange={handleDateChange}
              className="w-full bg-panel border-b-2 border-neon-amber/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-amber transition-colors"
              placeholder="MM/DD/YYYY"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tempTime" className="block text-xs font-mono text-neon-amber uppercase tracking-widest">
              Temporal Inception (Time)
            </label>
            <div className="flex gap-4">
              <input
                id="tempTime"
                name="tempTime"
                type="text"
                value={tempTime}
                onChange={handleTimeChange}
                className="flex-1 bg-panel border-b-2 border-neon-amber/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-amber transition-colors"
                placeholder="HH:MM"
                required
              />
              <select
                id="timePeriod"
                name="timePeriod"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-24 bg-panel border-b-2 border-neon-amber/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-amber transition-colors cursor-pointer appearance-none text-center"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 relative z-50">
            <label htmlFor="spatialCoords" className="block text-xs font-mono text-neon-gold uppercase tracking-widest">
               Spatial Coordinates
            </label>
            <div className="relative" ref={dropdownRef}>
              <input
                id="spatialCoords"
                name="spatialCoords"
                type="text"
                value={spatialCoords}
                onChange={handleSpatialChange}
                className="w-full bg-panel border-b-2 border-neon-gold/30 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-neon-gold transition-colors"
                placeholder="City, State, Country"
                required
              />
              
              {/* Places Autocomplete Dropdown */}
              <AnimatePresence>
                  {showPlacesDropdown && (
                      <motion.ul
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full left-0 w-full mt-2 z-50 bg-black/90 border border-neon-cyan/50 shadow-[0_10px_30px_rgba(0,240,255,0.2)] backdrop-blur-xl overflow-hidden rounded"
                      >
                          {placesPredictions.map((place, idx) => (
                              <li 
                                  key={idx}
                                  onClick={() => selectPlace(place)}
                                  className="px-4 py-3 text-sm font-mono text-white/70 hover:text-neon-gold hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                              >
                                  {place}
                              </li>
                          ))}
                      </motion.ul>
                  )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 mt-8 bg-transparent border border-neon-gold text-neon-gold font-bold tracking-[0.2em] uppercase hover:bg-neon-gold/10 transition-colors relative overflow-hidden group"
          >
            <span className="relative z-10">Initiate Diagnostic Weld</span>
            <div className="absolute inset-0 bg-neon-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
