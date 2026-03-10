export type ConnectionCategory = 'Social' | 'Family' | 'Work' | 'Romantic';

export interface NetworkConnection {
  id: string;
  name: string;
  category: ConnectionCategory;
  lastSync?: string;
}

export interface SynastryData {
  resonance: number;
  frictionPoints: number;
  activeHarmonics: string[];
  karmicLink: boolean;
}

export interface NetworkNodePayload {
  connection: NetworkConnection;
  synastry: SynastryData;
}
