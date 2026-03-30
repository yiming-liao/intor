/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { INTOR_HEADER_KEYS } from "../../../../../src/adapters/next/header-keys";
import { readIntorUrlState } from "../../../../../src/adapters/next/server/read-intor-url-state";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

function mockHeaders(map: Record<string, string>) {
  (headers as any).mockResolvedValue({
    get: (key: string) => map[key] ?? null,
  });
}

describe("readIntorUrlState (Next.js)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads values from headers", async () => {
    mockHeaders({
      [INTOR_HEADER_KEYS.LOCALE]: "en",
      [INTOR_HEADER_KEYS.PATHNAME]: "/works",
      [INTOR_HEADER_KEYS.SEARCH]: "?page=2",
    });
    const ctx = await readIntorUrlState();
    expect(ctx).toEqual({
      locale: "en",
      pathname: "/works",
      search: "?page=2",
    });
  });

  it("falls back to defaults when headers are missing", async () => {
    mockHeaders({});
    const ctx = await readIntorUrlState();
    expect(ctx).toEqual({
      locale: null,
      pathname: "/",
      search: "",
    });
  });

  it("handles partial headers correctly", async () => {
    mockHeaders({
      [INTOR_HEADER_KEYS.PATHNAME]: "/abc",
    });
    const ctx = await readIntorUrlState();
    expect(ctx).toEqual({
      locale: null,
      pathname: "/abc",
      search: "",
    });
  });

  it("handles empty string search explicitly", async () => {
    mockHeaders({
      [INTOR_HEADER_KEYS.SEARCH]: "",
    });
    const ctx = await readIntorUrlState();
    expect(ctx).toEqual({
      locale: null,
      pathname: "/",
      search: "",
    });
  });

  it("does not coerce null to string", async () => {
    (headers as any).mockResolvedValue({
      get: () => null,
    });
    const ctx = await readIntorUrlState();
    expect(ctx.locale).toBeNull();
    expect(ctx.pathname).toBe("/");
    expect(ctx.search).toBe("");
  });
});
