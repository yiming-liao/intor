import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMessages } from "@/modules/messages/load-api-messages/fetch-messages";

describe("fetchMessages", () => {
  const apiUrl = "https://fake.api/messages";
  const apiHeaders = { Authorization: "Bearer token" };
  const locale = "en-US";
  const searchParams = new URLSearchParams({ foo: "bar" });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  it("returns messages when fetch succeeds with valid JSON", async () => {
    const mockData = { hello: "world" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const result = await fetchMessages({
      apiUrl,
      apiHeaders,
      locale,
      searchParams,
    });

    expect(result).toEqual(mockData);
  });

  it("logs and returns undefined when JSON is null or empty object", async () => {
    const responses = [null, {}];
    for (const mockData of responses) {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await fetchMessages({
        apiUrl,
        apiHeaders,
        locale,
        searchParams,
      });

      expect(result).toBeUndefined();
    }
  });

  it("logs and returns undefined when fetch throws an error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await fetchMessages({
      apiUrl,
      apiHeaders,
      locale,
      searchParams,
    });

    expect(result).toBeUndefined();
  });

  it("appends locale to URLSearchParams", async () => {
    let capturedUrl = "";
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url as string;
      return Promise.resolve({
        ok: true,
        json: vi.fn().mockResolvedValue({ test: "ok" }),
      });
    });

    await fetchMessages({
      apiUrl,
      apiHeaders,
      locale,
      searchParams,
    });

    expect(capturedUrl).toContain("locale=en-US");
    expect(capturedUrl).toContain("foo=bar");
  });
});
