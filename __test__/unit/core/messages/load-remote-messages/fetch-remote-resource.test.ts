/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger";
import { fetchRemoteResource } from "@/core/messages/load-remote-messages/fetch-remote-resource";

describe("fetchRemoteResource", () => {
  const loggerChild = {
    debug: vi.fn(),
    warn: vi.fn(),
  };

  const logger = {
    child: vi.fn(() => loggerChild),
  };

  const baseParams = {
    url: "https://cdn.example.com/en/common.json",
    headers: { Authorization: "Bearer token" },
    loggerOptions: { id: "test" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(logger as any);
  });

  it("returns parsed messages when fetch succeeds", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ title: "Hello" }),
    } as any);
    const result = await fetchRemoteResource(baseParams);
    expect(result).toEqual({ title: "Hello" });
  });

  it("returns undefined when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as any);
    const result = await fetchRemoteResource(baseParams);
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });

  it("returns undefined when response payload is invalid", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => "not-an-object",
    } as any);
    const result = await fetchRemoteResource(baseParams);
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });

  it("returns early when fetch is aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error("Aborted"), { name: "AbortError" }),
      );
    const result = await fetchRemoteResource({
      ...baseParams,
      signal: controller.signal,
    });
    expect(result).toBeUndefined();
    expect(loggerChild.debug).toHaveBeenCalled();
  });

  it("returns undefined on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchRemoteResource(baseParams);
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });
});
