/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect as nextRedirect } from "next/navigation";
import { resolveOutbound } from "../../../../src/routing";
import { redirect } from "../../../../src/adapters/next/redirect";
import { getLocale } from "../../../../src/adapters/next/server/get-locale";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../../../../src/routing", () => ({
  resolveOutbound: vi.fn(),
}));

vi.mock("../../../../src/adapters/next/server/get-locale", () => ({
  getLocale: vi.fn(),
}));

describe("redirect (Next adapter)", () => {
  const config = { defaultLocale: "en" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves outbound using empty currentPathname and redirects", async () => {
    (getLocale as any).mockResolvedValue("en");
    (resolveOutbound as any).mockReturnValue({
      destination: "/en/about",
    });
    await redirect(config, "/about");
    expect(resolveOutbound).toHaveBeenCalledWith(config, "en", "", {
      destination: "/about",
    });
    expect(nextRedirect).toHaveBeenCalledWith("/en/about", undefined);
  });

  it("forwards locale override to resolveOutbound", async () => {
    (getLocale as any).mockResolvedValue("en");
    (resolveOutbound as any).mockReturnValue({
      destination: "/fr/about",
    });
    await redirect(config, "/about", { locale: "fr" });
    expect(resolveOutbound).toHaveBeenCalledWith(config, "en", "", {
      destination: "/about",
      locale: "fr",
    });
  });

  it("forwards redirect type to nextRedirect", async () => {
    (getLocale as any).mockResolvedValue("en");
    (resolveOutbound as any).mockReturnValue({
      destination: "/en/about",
    });
    await redirect(config, "/about", { type: "replace" as any });
    expect(nextRedirect).toHaveBeenCalledWith("/en/about", "replace");
  });

  it("redirects external destinations as returned by routing core", async () => {
    (getLocale as any).mockResolvedValue("en");
    (resolveOutbound as any).mockReturnValue({
      destination: "https://google.com",
    });
    await redirect(config, "https://google.com");
    expect(nextRedirect).toHaveBeenCalledWith("https://google.com", undefined);
  });
});
