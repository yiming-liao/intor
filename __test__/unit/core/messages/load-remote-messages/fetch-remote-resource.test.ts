/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "../../../../../src/core/logger";
import { fetchRemoteResource } from "../../../../../src/core/messages/load-remote-messages/fetch-remote-resource";
import * as utilsModule from "../../../../../src/core/messages/utils/is-valid-messages";

describe("fetchRemoteResource", () => {
  let warn: ReturnType<typeof vi.fn>;
  let debug: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    warn = vi.fn();
    debug = vi.fn();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({ warn, debug }),
    } as any);
  });

  it("returns data when fetch and validation succeed", async () => {
    vi.spyOn(utilsModule, "isValidMessages").mockReturnValue(true);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hello: "world" }),
    });
    const result = await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toEqual({ hello: "world" });
  });

  it("logs warning and returns undefined on HTTP error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    const result = await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });

  it("logs warning when message structure is invalid", async () => {
    vi.spyOn(utilsModule, "isValidMessages").mockReturnValue(false);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bad: "structure" }),
    });
    const result = await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });

  it("logs debug and returns undefined when aborted", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    const fetchMock = vi.fn().mockRejectedValue(abortError);
    const result = await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toBeUndefined();
    expect(debug).toHaveBeenCalledWith(
      "Remote fetch aborted.",
      expect.objectContaining({ url: "http://test" }),
    );
  });

  it("logs warning on generic network error", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Network"));
    const result = await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "Failed to fetch remote messages.",
      expect.objectContaining({ url: "http://test" }),
    );
  });

  it("passes signal to fetch when provided", async () => {
    vi.spyOn(utilsModule, "isValidMessages").mockReturnValue(true);
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) });
    const controller = new AbortController();
    await fetchRemoteResource({
      fetch: fetchMock,
      url: "http://test",
      signal: controller.signal,
      loggerOptions: { id: "TEST_ID" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://test",
      expect.objectContaining({
        signal: controller.signal,
      }),
    );
  });
});
