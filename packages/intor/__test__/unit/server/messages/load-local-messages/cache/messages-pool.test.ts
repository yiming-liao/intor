/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import {
  clearMessagesPool,
  getMessagesPool,
} from "../../../../../../src/server/messages/load-local-messages/cache";

describe("messages pool", () => {
  beforeEach(() => {
    delete (globalThis as any).__INTOR_MESSAGES_POOL__;
  });

  it("creates a new pool when none exists", () => {
    const pool = getMessagesPool();
    expect(pool).toBeInstanceOf(Map);
    expect(globalThis.__INTOR_MESSAGES_POOL__).toBe(pool);
  });

  it("returns the same pool instance on subsequent calls", () => {
    const first = getMessagesPool();
    const second = getMessagesPool();
    expect(first).toBe(second);
  });

  it("clears the existing pool", () => {
    const pool = getMessagesPool();
    pool.set("key", { en: { hello: "world" } });
    expect(pool.size).toBe(1);
    clearMessagesPool();
    expect(pool.size).toBe(0);
  });

  it("does not replace the pool instance when clearing", () => {
    const pool = getMessagesPool();
    clearMessagesPool();
    const after = getMessagesPool();
    expect(pool).toBe(after);
  });
});
