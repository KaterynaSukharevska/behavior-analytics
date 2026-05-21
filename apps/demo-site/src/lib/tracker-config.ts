export const TRACKER_SITE_ID = "demo-site";

export const TRACKER_ENDPOINT = "http://localhost:4000/api/events";

/** Set NEXT_PUBLIC_BA_TRACKER_DEBUG=1 to log page_view paths in the browser console (dev only). */
export const TRACKER_DEBUG =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_BA_TRACKER_DEBUG === "1";
