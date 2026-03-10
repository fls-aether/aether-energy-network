export type TemporalKey = 'today' | 'this_week' | 'this_month' | 'this_year';

export interface TransitTelemetry {
  active_transit: string;
  energy_status: string;
  system_warning?: string; // Optional warning
  recommended_activities: string[];
}

export type AetherForecastPayload = Record<TemporalKey, TransitTelemetry>;
