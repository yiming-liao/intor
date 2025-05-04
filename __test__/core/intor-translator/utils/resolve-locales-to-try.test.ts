import type { FallbackLocalesMap } from "@/intor/types/message-structure-types";
import type { MockLocaleNamespaceMessages } from "test/mock/locale-namespace-messages.mock";
import { resolveLocalesToTry } from "@/intor/core/intor-translator/utils/resolve-locales-to-try";
import { mockFallbackLocales } from "test/mock/fallback-locales.mock";

describe("resolveLocalesToTry", () => {
  it("returns primary locale first without fallback", () => {
    const result = resolveLocalesToTry<MockLocaleNamespaceMessages>(
      "ja-JP",
      mockFallbackLocales,
    );
    expect(result).toEqual(["ja-JP"]);
  });

  it("returns primary locale followed by fallbacks", () => {
    const result = resolveLocalesToTry<MockLocaleNamespaceMessages>(
      "en-US",
      mockFallbackLocales,
    );
    expect(result).toEqual(["en-US", "fr-FR", "zh-TW"]);
  });

  it("excludes primary locale if it appears in fallback list", () => {
    const customFallbackLocales: FallbackLocalesMap = {
      "en-US": ["en-US", "fr-FR", "zh-TW"],
      "fr-FR": ["fr-FR", "en-US"],
      "zh-TW": ["zh-TW", "en-US"],
      "ja-JP": ["ja-JP"],
    };

    const result = resolveLocalesToTry<MockLocaleNamespaceMessages>(
      "en-US",
      customFallbackLocales,
    );
    expect(result).toEqual(["en-US", "fr-FR", "zh-TW"]);
  });

  it("returns only primary locale if no fallback is defined", () => {
    const emptyFallbackLocales: FallbackLocalesMap = {
      "en-US": [],
      "fr-FR": [],
      "zh-TW": [],
      "ja-JP": [],
    };

    const result = resolveLocalesToTry<MockLocaleNamespaceMessages>(
      "zh-TW",
      emptyFallbackLocales,
    );
    expect(result).toEqual(["zh-TW"]);
  });

  it("handles undefined fallbackLocales safely", () => {
    const result = resolveLocalesToTry<MockLocaleNamespaceMessages>(
      "fr-FR",
      {} as FallbackLocalesMap,
    );
    expect(result).toEqual(["fr-FR"]);
  });
});
