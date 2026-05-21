export interface TrackerConfig {
  siteId: string;
  endpoint: string;
}

let trackerConfig: TrackerConfig | null = null;

export function setTrackerConfig(config: TrackerConfig): void {
  trackerConfig = config;
}

export function requireTrackerConfig(): TrackerConfig {
  if (!trackerConfig) {
    throw new Error(
      "Behavior Analytics tracker is not initialized. Call init() first.",
    );
  }

  return trackerConfig;
}
