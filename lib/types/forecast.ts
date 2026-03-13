export type TemporalKey = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear';

export interface TransitTelemetry {
  active_transit: string;
  energy_status: string;
  system_warning?: string; // Optional warning
  recommended_activities: string[];
}

import { TemporalForecast } from '../store';

export type AetherForecastPayload = TemporalForecast;
