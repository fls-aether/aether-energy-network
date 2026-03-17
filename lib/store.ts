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
    chineseZodiac: { placement: string; meaning: string };
    japanese: { placement: string; meaning: string };
    tzolkin: { placement: string; meaning: string };
    celticTree: { placement: string; meaning: string };
    decans: { placement: string; meaning: string };
    mahabote: { placement: string; meaning: string };
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
  // Persistent user selected profile image independent of current telemetry
  userProfileImage: string | null;
  setUserProfileImage: (url: string | null) => void;
  resetTelemetry: () => void;
  telemetryLastUpdated: number | null;
  setTelemetryLastUpdated: (timestamp: number) => void;
  
  // Phase 9: Cloud Sync
  syncFromCloud: () => Promise<void>;
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
      setGlobalTelemetry: (payload) => {
        set({ telemetry: payload });
        // Background sync to Neon Postgres
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload })
        }).catch(err => console.error("Telemetry API push failed", err));
      },
      
      setOperatorAvatar: (avatarData) => {
        set((state) => ({
          telemetry: state.telemetry 
            ? { ...state.telemetry, operatorAvatar: avatarData }
            : null
        }));
        // Background sync to Neon Postgres
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: avatarData })
        }).catch(err => console.error("Avatar API push failed", err));
      },

      userProfileImage: null,
      setUserProfileImage: (url) => set({ userProfileImage: url }),

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

      syncFromCloud: async () => {
        try {
          const res = await fetch('/api/telemetry');
          if (res.ok) {
            const data = await res.json();
            if (data.telemetry) {
              set({ 
                telemetry: data.telemetry.payload as TelemetryPayload,
                userProfileImage: data.telemetry.avatarUrl || null,
                syncCode: data.telemetry.operatorCode || null
              });
            }
          }
        } catch (e) {
          console.error("Cloud hydration failed:", e);
        }
      },
    }),
    {
      name: 'aether-energy-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
