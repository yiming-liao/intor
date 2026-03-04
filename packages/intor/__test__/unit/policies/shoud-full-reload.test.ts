/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveLoaderOptions } from "../../../src/core";
import { shouldFullReload } from "../../../src/policies/shoud-full-reload";

vi.mock("../../../src/core", async () => {
  const actual = await vi.importActual<any>("../../../src/core");
  return {
    ...actual,
    resolveLoaderOptions: vi.fn(),
  };
});

describe("shouldFullReload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseConfig = {
    routing: {
      outbound: {
        forceFullReload: false,
      },
    },
  } as any;

  it("returns false when no loader and forceFullReload is false", () => {
    (resolveLoaderOptions as any).mockReturnValue(undefined);
    const result = shouldFullReload(baseConfig);
    expect(result).toBe(false);
  });

  it("returns true when loader.mode is local", () => {
    (resolveLoaderOptions as any).mockReturnValue({ mode: "local" });
    const result = shouldFullReload(baseConfig);
    expect(result).toBe(true);
  });

  it("returns false when loader.mode is remote and forceFullReload is false", () => {
    (resolveLoaderOptions as any).mockReturnValue({ mode: "remote" });
    const result = shouldFullReload(baseConfig);
    expect(result).toBe(false);
  });

  it("returns true when forceFullReload is true even if loader is remote", () => {
    (resolveLoaderOptions as any).mockReturnValue({ mode: "remote" });
    const config = {
      routing: {
        outbound: {
          forceFullReload: true,
        },
      },
    };
    const result = shouldFullReload(config as any);
    expect(result).toBe(true);
  });

  it("returns true when forceFullReload is true and loader undefined", () => {
    (resolveLoaderOptions as any).mockReturnValue(undefined);
    const config = {
      routing: {
        outbound: {
          forceFullReload: true,
        },
      },
    };
    const result = shouldFullReload(config as any);
    expect(result).toBe(true);
  });
});
