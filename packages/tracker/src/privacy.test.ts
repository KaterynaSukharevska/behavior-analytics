import { afterEach, describe, expect, it, vi } from "vitest";
import type { IngestEventsRequest } from "@behavior-analytics/types";

class FakeElement {
  readonly dataset: Record<string, string | undefined>;
  readonly tagName: string;
  parentElement: FakeElement | null;
  textContent = "";

  constructor(
    tagName: string,
    dataset: Record<string, string | undefined> = {},
    parentElement: FakeElement | null = null,
  ) {
    this.tagName = tagName.toUpperCase();
    this.dataset = dataset;
    this.parentElement = parentElement;
  }

  closest(selector: string): FakeElement | null {
    let current: FakeElement | null = this;

    while (current) {
      if (
        selector === "[data-analytics-ignore]" &&
        current.dataset.analyticsIgnore !== undefined
      ) {
        return current;
      }

      if (
        selector === "[data-private]" &&
        current.dataset.private !== undefined
      ) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }
}

class FakeHTMLElement extends FakeElement {}

class FakeHTMLInputElement extends FakeHTMLElement {
  readonly type: string;

  constructor(
    type = "text",
    dataset: Record<string, string | undefined> = {},
    parentElement: FakeElement | null = null,
  ) {
    super("input", dataset, parentElement);
    this.type = type;
  }
}

type BrowserTestState = {
  click: (target: FakeElement) => void;
  fetchMock: ReturnType<typeof vi.fn>;
  localStorageGetItem: ReturnType<typeof vi.fn>;
};

function defineGlobal(name: string, value: unknown): void {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });
}

function readIngestBody(fetchMock: ReturnType<typeof vi.fn>): IngestEventsRequest {
  const call = fetchMock.mock.calls[0];
  if (!call) {
    throw new Error("Expected tracker to call fetch");
  }

  const init = call[1] as RequestInit;
  return JSON.parse(String(init.body)) as IngestEventsRequest;
}

function setupBrowser(): BrowserTestState {
  let clickHandler: ((event: MouseEvent) => void) | undefined;
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  const localStorageGetItem = vi.fn(() => "local-storage-secret");

  defineGlobal("Element", FakeElement);
  defineGlobal("HTMLElement", FakeHTMLElement);
  defineGlobal("HTMLInputElement", FakeHTMLInputElement);
  defineGlobal("navigator", {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  });
  defineGlobal("sessionStorage", {
    getItem: vi.fn(() => "session-123"),
    setItem: vi.fn(),
  });
  defineGlobal("localStorage", {
    getItem: localStorageGetItem,
    setItem: vi.fn(),
  });
  defineGlobal("window", {
    innerWidth: 1000,
    innerHeight: 500,
    location: {
      href: "https://example.test/pricing",
      pathname: "/pricing",
    },
    addEventListener: vi.fn(),
    scrollY: 0,
  });
  defineGlobal("document", {
    referrer: "https://referrer.test/",
    cookie: "email=katia@example.com; phone=123456789",
    body: new FakeHTMLElement("body"),
    documentElement: {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    },
    addEventListener: vi.fn((eventName: string, handler: EventListener) => {
      if (eventName === "click") {
        clickHandler = handler as (event: MouseEvent) => void;
      }
    }),
  });
  defineGlobal("fetch", fetchMock);

  return {
    click(target: FakeElement): void {
      if (!clickHandler) {
        throw new Error("Click listener was not attached");
      }

      clickHandler({
        button: 0,
        target,
        clientX: 100,
        clientY: 50,
      } as unknown as MouseEvent);
    },
    fetchMock,
    localStorageGetItem,
  };
}

async function startClickTrackingForTest(): Promise<BrowserTestState> {
  vi.resetModules();
  const browser = setupBrowser();
  const { setTrackerConfig } = await import("./config");
  const { startClickTracking } = await import("./click-tracking");

  setTrackerConfig({
    siteId: "demo-site",
    endpoint: "https://ingest.test/api/events",
  });
  startClickTracking();

  return browser;
}

async function setupTrackerForDirectCalls(): Promise<BrowserTestState> {
  vi.resetModules();
  const browser = setupBrowser();
  const { setTrackerConfig } = await import("./config");

  setTrackerConfig({
    siteId: "demo-site",
    endpoint: "https://ingest.test/api/events",
  });

  return browser;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("tracker privacy behavior", () => {
  it("click tracking sends data-analytics-id without DOM text", async () => {
    const browser = await startClickTrackingForTest();
    const button = new FakeHTMLElement("button", {
      analyticsId: "pricing-cta",
    });
    const label = new FakeHTMLElement("span", {}, button);
    label.textContent = "Contact Katia at katia@example.com";

    browser.click(label);

    expect(browser.fetchMock).toHaveBeenCalledTimes(1);
    const body = readIngestBody(browser.fetchMock);
    const event = body.events[0];
    const serializedBody = JSON.stringify(body);

    expect(event).toMatchObject({
      event_type: "click",
      site_id: "demo-site",
      element_id: "pricing-cta",
      element_tag: "button",
    });
    expect(event).not.toHaveProperty("element_text_short");
    expect(event).not.toHaveProperty("selector");
    expect(event).not.toHaveProperty("element_classes");
    expect(serializedBody).not.toContain("Contact Katia");
    expect(serializedBody).not.toContain("katia@example.com");
    expect(serializedBody).not.toContain("123456789");
    expect(serializedBody).not.toContain("local-storage-secret");
    expect(browser.localStorageGetItem).not.toHaveBeenCalled();
  });

  it("click tracking ignores data-analytics-ignore", async () => {
    const browser = await startClickTrackingForTest();
    const ignoredButton = new FakeHTMLElement("button", {
      analyticsId: "ignored-cta",
      analyticsIgnore: "",
    });

    browser.click(ignoredButton);

    expect(browser.fetchMock).not.toHaveBeenCalled();
  });

  it("click tracking ignores data-private", async () => {
    const browser = await startClickTrackingForTest();
    const privateButton = new FakeHTMLElement("button", {
      analyticsId: "private-cta",
      private: "",
    });

    browser.click(privateButton);

    expect(browser.fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["input", new FakeHTMLInputElement("text", { analyticsId: "email-input" })],
    ["textarea", new FakeHTMLElement("textarea", { analyticsId: "message" })],
    ["select", new FakeHTMLElement("select", { analyticsId: "plan-select" })],
  ])("click tracking ignores form %s elements", async (_, formElement) => {
    const browser = await startClickTrackingForTest();

    browser.click(formElement);

    expect(browser.fetchMock).not.toHaveBeenCalled();
  });

  it("conversion tracking sends explicit names and safe optional metadata only", async () => {
    const browser = await setupTrackerForDirectCalls();
    const { trackConversion } = await import("./conversion-tracking");

    await trackConversion(" pricing_cta_clicked ", {
      conversion_value: 99,
      utm_source: "pricing-page",
      page_url: "https://example.test/pricing",
      path: "/pricing",
      email: "katia@example.com",
      message: "Please contact me",
      phone: "123456789",
    } as Parameters<typeof trackConversion>[1] & Record<string, unknown>);

    const body = readIngestBody(browser.fetchMock);
    const event = body.events[0];
    const serializedBody = JSON.stringify(body);

    expect(event).toMatchObject({
      event_type: "conversion",
      conversion_name: "pricing_cta_clicked",
      conversion_value: 99,
      utm_source: "pricing-page",
    });
    expect(serializedBody).not.toContain("katia@example.com");
    expect(serializedBody).not.toContain("Please contact me");
    expect(serializedBody).not.toContain("123456789");
    expect(serializedBody).not.toContain("local-storage-secret");
    expect(browser.localStorageGetItem).not.toHaveBeenCalled();
  });

  it("page view tracking does not collect arbitrary page text", async () => {
    const browser = await setupTrackerForDirectCalls();
    const documentBody = document.body as unknown as FakeHTMLElement;
    documentBody.textContent =
      "Private page copy with email katia@example.com and phone 123456789";
    const { trackPageView } = await import("./index");

    await trackPageView();

    const body = readIngestBody(browser.fetchMock);
    const event = body.events[0];
    const serializedBody = JSON.stringify(body);

    expect(event).toMatchObject({
      event_type: "page_view",
      site_id: "demo-site",
      page_url: "https://example.test/pricing",
      path: "/pricing",
    });
    expect(serializedBody).not.toContain("Private page copy");
    expect(serializedBody).not.toContain("katia@example.com");
    expect(serializedBody).not.toContain("123456789");
    expect(serializedBody).not.toContain("local-storage-secret");
    expect(browser.localStorageGetItem).not.toHaveBeenCalled();
  });
});
