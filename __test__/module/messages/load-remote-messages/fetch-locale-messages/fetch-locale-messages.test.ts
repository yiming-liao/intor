/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchLocaleMessages } from "@/modules/messages/load-remote-messages/fetch-locale-messages";
import { isNamespaceMessages } from "@/modules/messages/shared/utils/is-namespace-messages";
import * as loggerModule from "@/shared/logger/get-logger";

vi.mock("@/modules/messages/shared/utils/is-namespace-messages");

describe("fetchLocaleMessages", () => {
  let fetchMock: typeof globalThis.fetch;
  let loggerChildMock: any;
  let loggerMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as any;

    loggerChildMock = { warn: vi.fn() };
    loggerMock = vi.fn().mockReturnValue({
      child: vi.fn().mockReturnValue(loggerChildMock),
    });

    vi.spyOn(loggerModule, "getLogger").mockImplementation(loggerMock);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and returns valid messages", async () => {
    const data = { "en-US": { ui: { hello: "Hello" } } };
    vi.mocked(fetchMock).mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    } as any);

    vi.mocked(isNamespaceMessages).mockReturnValue(true);

    const result = await fetchLocaleMessages({
      remoteUrl: "https://api.example.com/messages",
      locale: "en-US",
      searchParams: new URLSearchParams(),
      remoteHeaders: {},
      extraOptions: {},
    });

    expect(result).toEqual(data);
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns undefined when fetch fails", async () => {
    vi.mocked(fetchMock).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchLocaleMessages({
      remoteUrl: "https://api.example.com/messages",
      locale: "en-US",
      searchParams: new URLSearchParams(),
      remoteHeaders: {},
      extraOptions: {},
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalled();
  });

  it("returns undefined when HTTP status is not ok", async () => {
    vi.mocked(fetchMock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    } as any);

    const result = await fetchLocaleMessages({
      remoteUrl: "https://api.example.com/messages",
      locale: "en-US",
      searchParams: new URLSearchParams(),
      remoteHeaders: {},
      extraOptions: {},
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalled();
  });

  it("returns undefined when namespace validation fails", async () => {
    const data = { "en-US": { ui: { hello: "Hello" } } };
    vi.mocked(fetchMock).mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    } as any);

    (isNamespaceMessages as any).mockReturnValue(false);

    const result = await fetchLocaleMessages({
      remoteUrl: "https://api.example.com/messages",
      locale: "en-US",
      searchParams: new URLSearchParams(),
      remoteHeaders: {},
      extraOptions: {},
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalled();
  });
});
