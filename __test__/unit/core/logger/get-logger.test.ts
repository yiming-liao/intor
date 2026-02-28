/* eslint-disable @typescript-eslint/no-explicit-any */
import { logry } from "logry";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLogger } from "../../../../src/core/logger/get-logger";

vi.mock("logry", async (importActual) => {
  const actual = await importActual<typeof import("logry")>();
  return {
    ...actual,
    logry: vi.fn((opts: any) => ({ __mock: true, opts })),
  };
});

let pool: Map<string, any>;

vi.mock(
  "../../../../src/core/logger/global-logger-pool",
  async (importActual) => {
    const actual =
      await importActual<
        typeof import("../../../../src/core/logger/global-logger-pool")
      >();
    return {
      ...actual,
      getGlobalLoggerPool: () => pool,
    };
  },
);

describe("getLogger", () => {
  beforeEach(() => {
    pool = new Map();
    vi.clearAllMocks();
  });

  it("applies default format/render configs when no preset", () => {
    getLogger({ id: "a" });
    expect(logry).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "a",
        formatConfig: { timestamp: { withDate: false } },
        renderConfig: {
          id: { visible: true, prefix: "<", suffix: ">" },
          meta: { lineBreaksAfter: 1 },
        },
      }),
    );
  });

  it("does not apply default configs when preset is provided", () => {
    getLogger({ id: "b", preset: "minimal" });
    const callArg = (logry as any).mock.calls[0][0];
    expect(callArg.formatConfig).toBeUndefined();
    expect(callArg.renderConfig).toBeUndefined();
    expect(callArg.preset).toBe("minimal");
  });

  it("returns same logger instance for same id", () => {
    const first = getLogger({ id: "reuse" });
    const second = getLogger({ id: "reuse" });
    expect(first).toBe(second);
    expect(logry).toHaveBeenCalledTimes(1);
  });

  it("uses 'default' id when not provided", () => {
    getLogger({} as any);
    expect(logry).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "default",
      }),
    );
  });

  it("passes extra options to logry", () => {
    getLogger({
      id: "opt",
      level: "info" as any,
    });
    expect(logry).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "info",
      }),
    );
  });

  it("triggers soft cleanup when pool size exceeds threshold", () => {
    for (let i = 0; i < 1001; i++) {
      pool.set(`key-${i}`, { dummy: true });
    }
    getLogger({ id: "new" });
    expect(pool.size).toBeLessThanOrEqual(1000);
  });
});
