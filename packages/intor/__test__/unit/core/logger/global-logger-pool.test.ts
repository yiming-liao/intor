/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import {
  getGlobalLoggerPool,
  clearLoggerPool,
} from "../../../../src/core/logger/global-logger-pool";

describe("getGlobalLoggerPool", () => {
  beforeEach(() => {
    delete (globalThis as any).__INTOR_LOGGER_POOL__;
  });

  it("creates pool if not exists", () => {
    const pool = getGlobalLoggerPool();

    expect(pool).toBeInstanceOf(Map);
    expect(globalThis.__INTOR_LOGGER_POOL__).toBe(pool);
  });

  it("returns same pool instance across calls", () => {
    const first = getGlobalLoggerPool();
    const second = getGlobalLoggerPool();

    expect(first).toBe(second);
  });

  it("clearLoggerPool empties existing pool", () => {
    const pool = getGlobalLoggerPool();
    pool.set("a", {} as any);

    clearLoggerPool();

    expect(pool.size).toBe(0);
  });
});
