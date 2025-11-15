/* eslint-disable unicorn/no-useless-undefined */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFallbackMessages } from "@/modules/messages/load-api-messages/fetch-fallback-messages";
import * as fetchModule from "@/modules/messages/load-api-messages/fetch-messages";

describe("fetchFallbackMessages", () => {
  const apiUrl = "https://fake.api/messages";
  const apiHeaders = { Authorization: "Bearer token" };
  const searchParams = new URLSearchParams();
  const fallbackLocales = ["fr-FR", "de-DE", "es-ES"];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the first successful fallback locale", async () => {
    const mockFetch = vi
      .spyOn(fetchModule, "fetchMessages")
      .mockImplementation(async ({ locale }) => {
        if (locale === "de-DE")
          return { hello: "world" } as unknown as LocaleMessages;
      });

    const result = await fetchFallbackMessages({
      apiUrl,
      apiHeaders,
      searchParams,
      fallbackLocales,
    });

    expect(result).toEqual({ locale: "de-DE", messages: { hello: "world" } });
    expect(mockFetch).toHaveBeenCalledTimes(2); // fr-FR fails, de-DE succeeds
  });

  it("returns undefined if all fallbacks fail", async () => {
    vi.spyOn(fetchModule, "fetchMessages").mockResolvedValue(undefined);

    const result = await fetchFallbackMessages({
      apiUrl,
      apiHeaders,
      searchParams,
      fallbackLocales,
    });

    expect(result).toBeUndefined();
  });

  it("returns immediately if the first fallback succeeds", async () => {
    const mockFetch = vi
      .spyOn(fetchModule, "fetchMessages")
      .mockImplementation(async ({ locale }) => {
        if (locale === "fr-FR")
          return { msg: "ok" } as unknown as LocaleMessages;
        return;
      });

    const result = await fetchFallbackMessages({
      apiUrl,
      apiHeaders,
      searchParams,
      fallbackLocales,
    });

    expect(result).toEqual({ locale: "fr-FR", messages: { msg: "ok" } });
    expect(mockFetch).toHaveBeenCalledTimes(1); // stops after first success
  });
});
