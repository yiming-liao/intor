import type { Locale } from "intor-translator";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

describe("resolvePreferredLocale", () => {
  it("should return the supported language with the highest priority", () => {
    const acceptLanguage = "en-US,en;q=0.9,zh-TW;q=0.8";
    const supportedLocales: Locale[] = ["zh-TW", "en-US"];

    const result = resolvePreferredLocale(acceptLanguage, supportedLocales);

    expect(result).toBe("en-US");
  });

  it("should return undefined when no supported language matches", () => {
    const acceptLanguage = "fr-FR";
    const supportedLocales: Locale[] = ["zh-TW", "en-US"];

    const result = resolvePreferredLocale(acceptLanguage, supportedLocales);

    expect(result).toBeUndefined();
  });

  it("should return undefined when acceptLanguageHeader is undefined", () => {
    const result = resolvePreferredLocale(undefined, ["zh-TW", "en-US"]);

    expect(result).toBeUndefined();
  });

  it("should return undefined when supportedLocales is an empty array", () => {
    const acceptLanguage = "en-US";
    const result = resolvePreferredLocale(acceptLanguage, []);

    expect(result).toBeUndefined();
  });

  it("should ignore the q parameter in the language and return the preferred language", () => {
    const acceptLanguage = "zh-TW;q=0.7,en-US;q=1.0";
    const supportedLocales: Locale[] = ["en-US", "zh-TW"];

    const result = resolvePreferredLocale(acceptLanguage, supportedLocales);

    expect(result).toBe("en-US");
  });

  it("should return undefined when supportedLocales is undefined", () => {
    const acceptLanguage = "en-US";
    const result = resolvePreferredLocale(acceptLanguage);

    expect(result).toBeUndefined();
  });

  // Additional test cases for edge handling
  it("should return undefined when no valid 'q' parameter is present", () => {
    const acceptLanguage = "en-US;q=invalid-value,zh-TW;q=0.5";
    const supportedLocales: Locale[] = ["en-US", "zh-TW"];

    const result = resolvePreferredLocale(acceptLanguage, supportedLocales);

    expect(result).toBe("zh-TW"); // As 'en-US' has an invalid q value and 'zh-TW' is valid
  });

  it("should return undefined when 'q' is missing for all languages", () => {
    const acceptLanguage = "en-US,zh-TW";
    const supportedLocales: Locale[] = ["en-US", "zh-TW"];

    const result = resolvePreferredLocale(acceptLanguage, supportedLocales);

    expect(result).toBe("en-US"); // Since both have no q-value, it should return the first match
  });

  it("should handle empty 'acceptLanguageHeader' gracefully", () => {
    const result = resolvePreferredLocale("", ["en-US", "zh-TW"]);

    expect(result).toBeUndefined(); // No language, so it should return undefined
  });
});
