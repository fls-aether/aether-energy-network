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
  culturalSystems: {
    chineseZodiac: string;
    japanese: string;
    tzolkin: string;
    celticTree: string;
    decans: string;
    mahabote: string;
    systemOverview: string;
  };
  theoreticalAxiom: {
    thirteenSignZodiac: string;
    cotsworthDate: string;
    axiomInsight: string;
  };
}

export interface TemporalForecastBlock {
  transitTitle: string;
  energyStatus: string;
  primaryDirective: string;
  secondaryDirective: string;
}

export interface TemporalForecast {
  today: TemporalForecastBlock;
  thisWeek: TemporalForecastBlock;
  thisMonth: TemporalForecastBlock;
  thisYear: TemporalForecastBlock;
}

export interface BiometricIntegrity {
  logic: number;
  drive: number;
  empathy: number;
  stability: number;
}

export interface AetherealCodex {
  biometricIntegrity: BiometricIntegrity;
  operatorClass: string;
  classDescription: string;
  codexLore: string;
  systemInsight: string;
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
  temporalForecast?: TemporalForecast;
  aetherealCodex?: AetherealCodex;
  operatorAvatar?: string;
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
  setGlobalTelemetry: (payload: TelemetryPayload) => void;
  setOperatorAvatar: (avatarData: string) => void;
  resetTelemetry: () => void;
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
      setGlobalTelemetry: (payload) => set({ telemetry: payload }),
      
      setOperatorAvatar: (avatarData) => set((state) => ({
        telemetry: state.telemetry 
          ? { ...state.telemetry, operatorAvatar: avatarData }
          : null // Changed from undefined to null to match telemetry type
      })),

      resetTelemetry: () => set({ 
        // Assuming 'identity', 'activeSystem' are properties that might be added later,
        // for now, only resetting telemetry and stats as per context.
        // identity: null, 
        telemetry: null, 
        stats: null, 
        // activeSystem: "Tropical Placidus" 
      }),
      telemetryLastUpdated: null,
      setTelemetryLastUpdated: (timestamp) => set({ telemetryLastUpdated: timestamp }),
    }),
    {
      name: 'aether-energy-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
