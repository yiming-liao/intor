/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "../../../../../src/core/logger";
import { fetchRemoteResource } from "../../../../../src/core/messages/load-remote-messages/fetch-remote-resource";

describe("fetchRemoteResource", () => {
  const loggerChild = {
    debug: vi.fn(),
    warn: vi.fn(),
  };

  const logger = {
    child: vi.fn(() => loggerChild),
  };

  let mockFetch: any;

  const baseParams = () => ({
    url: "https://cdn.example.com/en/common.json",
    headers: { Authorization: "Bearer token" },
    loggerOptions: { id: "test" },
    fetch: mockFetch,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(logger as any);
    mockFetch = vi.fn();
  });

  it("returns parsed messages when fetch succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ title: "Hello" }),
    } as any);
    const result = await fetchRemoteResource(baseParams());
    expect(result).toEqual({ title: "Hello" });
  });

  it("returns undefined when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as any);
    const result = await fetchRemoteResource(baseParams());
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });

  it("returns undefined when response payload is invalid", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => "not-an-object",
    } as any);
    const result = await fetchRemoteResource(baseParams());
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });

  it("returns early when fetch is aborted", async () => {
    const controller = new AbortController();
    const mockFetch = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error("Aborted"), { name: "AbortError" }),
      );
    controller.abort();
    const result = await fetchRemoteResource({
      ...baseParams(),
      fetch: mockFetch,
      signal: controller.signal,
    });
    expect(result).toBeUndefined();
    expect(loggerChild.debug).toHaveBeenCalledWith(
      "Remote fetch aborted.",
      expect.objectContaining({ url: baseParams().url }),
    );
  });

  it("returns undefined on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await fetchRemoteResource(baseParams());
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });
});
