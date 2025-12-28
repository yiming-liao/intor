/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as loggerModule from "@/shared/logger/get-logger";
import { fetchLocaleMessages } from "@/shared/messages/load-remote-messages/fetch-locale-messages";
import * as isValidMessagesModule from "@/shared/messages/utils/is-valid-messages";

vi.mock("@/shared/messages/utils/is-valid-messages");

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
    vi.spyOn(isValidMessagesModule, "isValidMessages").mockReturnValue(true);
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

    vi.mocked(isValidMessagesModule.isValidMessages).mockReturnValue(true);

    const result = await fetchLocaleMessages({
      url: "https://api.example.com/messages",
      locale: "en-US",
      headers: {},
      extraOptions: { loggerOptions: { id: "" } },
    });

    expect(result).toEqual(data);
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns undefined when fetch fails", async () => {
    vi.mocked(fetchMock).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchLocaleMessages({
      url: "https://api.example.com/messages",
      locale: "en-US",
      headers: {},
      extraOptions: { loggerOptions: { id: "" } },
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
      url: "https://api.example.com/messages",
      locale: "en-US",
      headers: {},
      extraOptions: { loggerOptions: { id: "" } },
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

    (isValidMessagesModule.isValidMessages as any).mockReturnValue(false);

    const result = await fetchLocaleMessages({
      url: "https://api.example.com/messages",
      locale: "en-US",
      headers: {},
      extraOptions: { loggerOptions: { id: "" } },
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalled();
  });
});
