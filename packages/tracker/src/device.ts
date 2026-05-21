import type { DeviceType } from "@behavior-analytics/types";

export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

  const userAgent = navigator.userAgent;

  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) {
    return "tablet";
  }

  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return "mobile";
  }

  if (userAgent.length > 0) {
    return "desktop";
  }

  return "unknown";
}
