/* eslint-disable @typescript-eslint/no-explicit-any */
import pLimit from "p-limit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "../../../../../src/core/logger";
import * as collectModule from "../../../../../src/core/messages/load-remote-messages/collect-remote-resources";
import * as fetchModule from "../../../../../src/core/messages/load-remote-messages/fetch-remote-resource";
import { loadRemoteMessages } from "../../../../../src/core/messages/load-remote-messages/load-remote-messages";
import * as resolveModule from "../../../../../src/core/messages/load-remote-messages/resolve-remote-resources";

vi.mock("p-limit", () => ({
  default: vi.fn(() => (fn: any) => fn()),
}));

describe("loadRemoteMessages", () => {
  let debug: any;
  let warn: any;
  let trace: any;

  beforeEach(() => {
    vi.clearAllMocks();
    debug = vi.fn();
    warn = vi.fn();
    trace = vi.fn();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({ debug, warn, trace }),
    } as any);
  });

  it("aborts early when signal already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const result = await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
      signal: controller.signal,
    } as any);
    expect(result).toBeUndefined();
    expect(debug).toHaveBeenCalledWith(
      "Remote message loading aborted before fetch.",
    );
  });

  it("loads messages successfully for primary locale", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockReturnValue([
      { url: "a", path: "a" },
    ] as any);
    vi.spyOn(fetchModule, "fetchRemoteResource").mockResolvedValue({
      hello: "world",
    } as any);
    vi.spyOn(resolveModule, "resolveRemoteResources").mockReturnValue({
      merged: true,
    } as any);
    const result = await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
    } as any);
    expect(result).toEqual({
      en: { merged: true },
    });
    expect(trace).toHaveBeenCalled();
  });

  it("falls back when primary locale has no valid results", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockReturnValue([
      { url: "a", path: "a" },
    ] as any);
    const fetchSpy = vi
      .spyOn(fetchModule, "fetchRemoteResource")
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ foo: "bar" });

    vi.spyOn(resolveModule, "resolveRemoteResources").mockReturnValue({
      merged: true,
    } as any);
    const result = await loadRemoteMessages({
      locale: "en",
      fallbackLocales: ["zh"],
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
    } as any);
    expect(result).toEqual({ zh: { merged: true } });
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("warns when all candidate locales fail", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockImplementation(() => {
      throw new Error("fail");
    });
    const result = await loadRemoteMessages({
      locale: "en",
      fallbackLocales: ["zh"],
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
    } as any);
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "Failed to load messages for all candidate locales.",
      expect.any(Object),
    );
  });

  it("aborts during loop when signal aborted", async () => {
    const controller = new AbortController();
    vi.spyOn(collectModule, "collectRemoteResources").mockImplementation(() => {
      controller.abort();
      throw new Error("fail");
    });
    const result = await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
      signal: controller.signal,
    } as any);
    expect(result).toBeUndefined();
    expect(debug).toHaveBeenCalledWith("Remote message loading aborted.");
  });

  it("uses pLimit when concurrency provided", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockReturnValue([
      { url: "a", path: "a" },
    ] as any);
    vi.spyOn(fetchModule, "fetchRemoteResource").mockResolvedValue({
      hello: "world",
    } as any);
    vi.spyOn(resolveModule, "resolveRemoteResources").mockReturnValue({
      merged: true,
    } as any);
    const result = await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "http://x",
      loggerOptions: {},
      concurrency: 1,
    } as any);
    expect(result).toEqual({
      en: { merged: true },
    });
    expect(pLimit).toHaveBeenCalledWith(1);
  });

  it("passes namespaces when provided", async () => {
    const collectSpy = vi
      .spyOn(collectModule, "collectRemoteResources")
      .mockReturnValue([{ url: "a", path: "a" }] as any);
    vi.spyOn(fetchModule, "fetchRemoteResource").mockResolvedValue({} as any);
    vi.spyOn(resolveModule, "resolveRemoteResources").mockReturnValue(
      {} as any,
    );
    await loadRemoteMessages({
      locale: "en",
      namespaces: ["common"],
      fetch: vi.fn(),
      url: "x",
      loggerOptions: {},
    } as any);
    expect(collectSpy).toHaveBeenCalledWith(
      expect.objectContaining({ namespaces: ["common"] }),
    );
  });

  it("passes headers and signal to fetchRemoteResource", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockReturnValue([
      { url: "a", path: "a" },
    ] as any);
    const fetchSpy = vi
      .spyOn(fetchModule, "fetchRemoteResource")
      .mockResolvedValue({} as any);

    vi.spyOn(resolveModule, "resolveRemoteResources").mockReturnValue(
      {} as any,
    );
    const controller = new AbortController();
    await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "x",
      loggerOptions: {},
      headers: { Authorization: "x" },
      signal: controller.signal,
    } as any);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { Authorization: "x" },
        signal: controller.signal,
      }),
    );
  });

  it("passes resource without data when some fetch results are undefined", async () => {
    vi.spyOn(collectModule, "collectRemoteResources").mockReturnValue([
      { url: "a", path: "a" },
      { url: "b", path: "b" },
    ] as any);
    vi.spyOn(fetchModule, "fetchRemoteResource")
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ foo: "bar" });
    const resolveSpy = vi
      .spyOn(resolveModule, "resolveRemoteResources")
      .mockReturnValue({ merged: true } as any);
    await loadRemoteMessages({
      locale: "en",
      fetch: vi.fn(),
      url: "x",
      loggerOptions: {},
    } as any);
    expect(resolveSpy).toHaveBeenCalledWith([
      { path: "a" },
      { path: "b", data: { foo: "bar" } },
    ]);
  });
});
