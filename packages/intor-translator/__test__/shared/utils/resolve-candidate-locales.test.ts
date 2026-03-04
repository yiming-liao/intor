import type { FallbackLocalesMap } from "../../../src/types";
import { describe, expect, it } from "vitest";
import { resolveCandidateLocales } from "../../../src/shared/utils/resolve-candidate-locales";

export const mockFallbackLocales: FallbackLocalesMap = {
  "en-US": ["fr-FR", "zh-TW"],
  "fr-FR": ["en-US"],
  "zh-TW": ["en-US"],
  "ja-JP": [],
};

describe("resolveCandidateLocales", () => {
  it("returns primary locale first without fallback", () => {
    const result = resolveCandidateLocales("ja-JP", mockFallbackLocales);
    expect(result).toEqual(["ja-JP"]);
  });

  it("returns primary locale followed by fallbacks", () => {
    const result = resolveCandidateLocales("en-US", mockFallbackLocales);
    expect(result).toEqual(["en-US", "fr-FR", "zh-TW"]);
  });

  it("excludes primary locale if it appears in fallback list", () => {
    const customFallbackLocales: FallbackLocalesMap = {
      "en-US": ["en-US", "fr-FR", "zh-TW"],
      "fr-FR": ["fr-FR", "en-US"],
      "zh-TW": ["zh-TW", "en-US"],
      "ja-JP": ["ja-JP"],
    };

    const result = resolveCandidateLocales("en-US", customFallbackLocales);
    expect(result).toEqual(["en-US", "fr-FR", "zh-TW"]);
  });

  it("returns only primary locale if no fallback is defined", () => {
    const emptyFallbackLocales: FallbackLocalesMap = {
      "en-US": [],
      "fr-FR": [],
      "zh-TW": [],
      "ja-JP": [],
    };

    const result = resolveCandidateLocales("zh-TW", emptyFallbackLocales);
    expect(result).toEqual(["zh-TW"]);
  });

  it("handles undefined fallbackLocales safely", () => {
    const result = resolveCandidateLocales("fr-FR", {} as FallbackLocalesMap);
    expect(result).toEqual(["fr-FR"]);
  });
});
