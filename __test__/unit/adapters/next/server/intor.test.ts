/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intor as intorCore } from "../../../../../src/server";
import { intor } from "../../../../../src/adapters/next/server/intor";
import { getLocale } from "../../../../../src/adapters/next/server/get-locale";

vi.mock("../../../../../src/server", () => ({ intor: vi.fn() }));
vi.mock("../../../../../src/adapters/next/server/get-locale", () => ({
  getLocale: vi.fn(),
}));

describe("intor (Next adapter)", () => {
  const config = { defaultLocale: "en" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses locale returned from getLocale", async () => {
    (getLocale as any).mockResolvedValue("fr");
    (intorCore as any).mockResolvedValue("value");
    await intor(config);
    expect(getLocale).toHaveBeenCalledWith(config);
    expect(intorCore).toHaveBeenCalledWith(config, "fr", {
      allowCacheWrite: true,
    });
  });

  it("forwards readers when provided", async () => {
    (getLocale as any).mockResolvedValue("en");
    (intorCore as any).mockResolvedValue("value");
    const readers = { json: vi.fn() } as any;
    await intor(config, { readers });
    expect(intorCore).toHaveBeenCalledWith(config, "en", {
      readers,
      allowCacheWrite: true,
    });
  });

  it("respects allowCacheWrite=false", async () => {
    (getLocale as any).mockResolvedValue("en");
    (intorCore as any).mockResolvedValue("value");
    await intor(config, { allowCacheWrite: false });
    expect(intorCore).toHaveBeenCalledWith(config, "en", {
      allowCacheWrite: false,
    });
  });

  it("defaults allowCacheWrite to true when not provided", async () => {
    (getLocale as any).mockResolvedValue("en");
    (intorCore as any).mockResolvedValue("value");
    await intor(config, {});
    expect(intorCore).toHaveBeenCalledWith(config, "en", {
      allowCacheWrite: true,
    });
  });
});
