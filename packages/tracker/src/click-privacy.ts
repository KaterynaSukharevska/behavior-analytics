const SENSITIVE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION"]);

export function isClickIgnored(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return true;
  }

  let element: Element | null = target;

  while (element) {
    if (element instanceof HTMLElement) {
      if (element.dataset.analyticsIgnore !== undefined) {
        return true;
      }

      if (element.dataset.private !== undefined) {
        return true;
      }
    }

    if (SENSITIVE_TAGS.has(element.tagName)) {
      return true;
    }

    if (
      element.tagName === "INPUT" &&
      element instanceof HTMLInputElement &&
      element.type === "password"
    ) {
      return true;
    }

    if (element.closest("[data-analytics-ignore]") !== null) {
      return true;
    }

    if (element.closest("[data-private]") !== null) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}

/** Nearest ancestor (or self) with data-analytics-id. */
export function findAnalyticsClickTarget(
  target: EventTarget | null,
): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  let element: Element | null = target;

  while (element) {
    if (element instanceof HTMLElement && element.dataset.analyticsId) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
}
