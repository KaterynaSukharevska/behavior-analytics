import { createId } from "./create-id";

export const SESSION_STORAGE_KEY = "behavior_analytics_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return createId();
  }

  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const sessionId = createId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return createId();
  }
}
