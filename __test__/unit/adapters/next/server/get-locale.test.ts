/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { headers, cookies } from "next/headers";
import { getLocale } from "../../../../../src/adapters/next/server/get-locale";
import { INTOR_HEADERS, matchLocale } from "../../../../../src/core";

vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }));
vi.mock("../../../../../src/core", async (original) => {
  const actual = (await original()) as any;
  return { ...actual, matchLocale: vi.fn() };
});

describe("getLocale (Next adapter)", () => {
  const config = {
    defaultLocale: "en",
    cookie: { name: "locale" },
    supportedLocales: ["en", "fr"],
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns locale from inbound header when present", async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn((key: string) => (key === INTOR_HEADERS.LOCALE ? "fr" : null)),
    });
    const result = await getLocale(config);
    expect(result).toBe("fr");
  });

  it("returns matched locale from cookie when header is missing", async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn(() => null),
    });
    (cookies as any).mockResolvedValue({
      get: vi.fn(() => ({ value: "fr" })),
    });
    (matchLocale as any).mockReturnValue("fr");
    const result = await getLocale(config);
    expect(matchLocale).toHaveBeenCalledWith("fr", config.supportedLocales);
    expect(result).toBe("fr");
  });

  it("falls back to defaultLocale when cookie does not match", async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn(() => null),
    });
    (cookies as any).mockResolvedValue({
      get: vi.fn(() => ({ value: "unknown" })),
    });
    (matchLocale as any).mockReturnValue(undefined);
    const result = await getLocale(config);
    expect(result).toBe("en");
  });

  it("falls back to defaultLocale when header and cookie are absent", async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn(() => null),
    });
    (cookies as any).mockResolvedValue({
      get: vi.fn(() => undefined),
    });
    const result = await getLocale(config);
    expect(result).toBe("en");
  });
});
