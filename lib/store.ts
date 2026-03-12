import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { TelemetryStats } from './calculations';

export interface AstrologicalPlacement {
  celestialBody: string;
  sign: string;
  degree: string;
  house: string;
  isRetrograde: boolean;
  esotericMeaning: string;
}

export interface IdentitiesMatrix {
  tropical: AstrologicalPlacement[];
  sidereal: AstrologicalPlacement[];
  draconic: AstrologicalPlacement[];
  heliocentric: AstrologicalPlacement[];
  numerology: {
    lifePath: string;
    coreArchetype: string;
    mode: string;
    anchor: string;
    systemOverview: string;
  };
  starseed: {
    originPoint: string;
    masterSpiritualCourt: string;
    systemOverview: string;
  };
  cultural: {
    chineseZodiac: string;
    japanese: string;
    tzolkin: string;
    celticTree: string;
    decans: string;
    mahabote: string;
    systemOverview: string;
  };
}

export interface TelemetryPayload {
  integrityPercentage: number;
  kineticOutput: string;
  kineticSummary: string;
  epicycle: string;
  nextFullMoon: string;
  nextNewMoon: string;
  cosmicAnomalies: string;
  dailyAffirmation: string;
  identitiesMatrix?: IdentitiesMatrix;
}

interface OperatorState {
  isRegistered: boolean;
  setRegistered: (status: boolean) => void;
  userAge: number | null;
  isAdult: boolean;
  setAgeData: (age: number, isAdult: boolean) => void;
  stats: TelemetryStats | null;
  setStats: (stats: TelemetryStats) => void;
  
  operatorDetails: { name: string; date: string; time: string; location: string } | null;
  setOperatorDetails: (details: { name: string; date: string; time: string; location: string } | null) => void;
  
  // Phase 26 additions
  syncCode: string | null;
  setSyncCode: (code: string) => void;
  confirmedConnections: Array<{ id: string; name: string; timestamp: string }>;
  addConnection: (connection: { id: string; name: string; timestamp: string }) => void;

  telemetry: TelemetryPayload | null;
  setTelemetry: (data: TelemetryPayload | null) => void;
  telemetryLastUpdated: number | null;
  setTelemetryLastUpdated: (timestamp: number) => void;
}

export const useOperatorStore = create<OperatorState>()(
  persist(
    (set) => ({
      isRegistered: false,
      setRegistered: (status) => set({ isRegistered: status }),
      userAge: null,
      isAdult: false,
      setAgeData: (age, isAdult) => set({ userAge: age, isAdult }),
      stats: null,
      setStats: (stats) => set({ stats }),
      
      operatorDetails: null,
      setOperatorDetails: (details) => set({ operatorDetails: details }),
      
      syncCode: null,
      setSyncCode: (code) => set({ syncCode: code }),
      
      // Mock Data initialized for Phase 26
      confirmedConnections: [],
      addConnection: (connection) => set((state) => ({
        confirmedConnections: [...state.confirmedConnections, connection]
      })),

      telemetry: null,
      setTelemetry: (data) => set({ telemetry: data }),
      telemetryLastUpdated: null,
      setTelemetryLastUpdated: (timestamp) => set({ telemetryLastUpdated: timestamp }),
    }),
    {
      name: 'aether-energy-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
