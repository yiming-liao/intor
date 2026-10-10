import { describe, it, expect } from "vitest";
import { getLocaleFromAcceptLanguage } from "../../../../src/routing";

describe("getLocaleFromAcceptLanguage", () => {
  it.each(["0.001", "0.01", "0.1"])(
    "accepts positive lower-bound weight %s",
    (weight) => {
      expect(
        getLocaleFromAcceptLanguage(`en;q=${weight},fr;q=0`, ["en", "fr"]),
      ).toBe("en");
    },
  );

  it.each(["en;q=1.0000", "en;q=1e0", "en;q=+1", "en;q=01"])(
    "rejects invalid numeric form %s",
    (header) => {
      expect(getLocaleFromAcceptLanguage(header, ["en"])).toBeUndefined();
    },
  );

  it("ignores empty list entries while retaining a valid candidate", () => {
    expect(getLocaleFromAcceptLanguage(", ,en;q=0.5,,", ["en"])).toBe("en");
  });
  it.each([
    "q=2",
    "q=Infinity",
    "q=-0.1",
    "q=0.9oops",
    "q=.9",
    "q=0.9000",
    "q=1.001",
    "q=",
    "foo=1",
    "q=0.9;q=0",
  ])(
    "skips malformed weight %s without discarding other candidates",
    (weight) => {
      expect(
        getLocaleFromAcceptLanguage(`en;${weight},fr;q=0.8`, ["en", "fr"]),
      ).toBe("fr");
      expect(
        getLocaleFromAcceptLanguage(`en;${weight}`, ["en"]),
      ).toBeUndefined();
    },
  );

  it.each(["q=1", "q=1.", "q=1.000", "q=0.9", "q=0.999", "Q=0.9", "\tQ=0.9\t"])(
    "accepts valid weight %s",
    (weight) => {
      expect(
        getLocaleFromAcceptLanguage(`en;${weight},fr;q=0.8`, ["en", "fr"]),
      ).toBe("en");
    },
  );

  it.each(["0", "0.", "0.000"])("excludes valid zero weight %s", (weight) => {
    expect(
      getLocaleFromAcceptLanguage(`en;q=${weight}`, ["en"]),
    ).toBeUndefined();
  });

  it("preserves header order for equal weights", () => {
    expect(getLocaleFromAcceptLanguage("fr;q=0.8,en;q=0.8", ["en", "fr"])).toBe(
      "fr",
    );
  });

  it.each(["en;q=0", "fr;q=1,en;q=0", "en;q=oops"])(
    "does not select a zero-weight supported candidate from %s",
    (header) => {
      expect(getLocaleFromAcceptLanguage(header, ["en"])).toBeUndefined();
    },
  );

  it("selects a positive-weight candidate over an excluded language", () => {
    expect(getLocaleFromAcceptLanguage("en;q=0,fr;q=0.1", ["en", "fr"])).toBe(
      "fr",
    );
  });

  it("returns undefined when header is missing", () => {
    const result = getLocaleFromAcceptLanguage(undefined, ["en", "zh"]);
    expect(result).toBeUndefined();
  });

  it("returns undefined when supportedLocales is empty", () => {
    const result = getLocaleFromAcceptLanguage("en-US,en;q=0.9", []);
    expect(result).toBeUndefined();
  });

  it("returns the highest q-value locale that is supported", () => {
    const result = getLocaleFromAcceptLanguage("en-US;q=0.5, zh-TW;q=0.9", [
      "en-US",
      "zh-TW",
    ]);
    expect(result).toBe("zh-TW");
  });

  it("defaults q-value to 1 when not provided", () => {
    const result = getLocaleFromAcceptLanguage("ja, en;q=0.5", ["en", "ja"]);
    expect(result).toBe("ja");
  });

  it("skips languages not in supportedLocales", () => {
    const result = getLocaleFromAcceptLanguage("fr, en;q=0.8", ["en", "zh"]);
    expect(result).toBe("en");
  });

  it("skips invalid q-values", () => {
    const result = getLocaleFromAcceptLanguage("en;q=oops, zh;q=0.2", [
      "en",
      "zh",
    ]);
    expect(result).toBe("zh");
  });

  it("returns undefined if none of the preferred languages match", () => {
    const result = getLocaleFromAcceptLanguage("fr, de;q=0.7", ["en", "ja"]);
    expect(result).toBeUndefined();
  });

  it("correctly trims whitespace", () => {
    const result = getLocaleFromAcceptLanguage("   en-US  , zh-TW;q=0.8  ", [
      "en-US",
      "zh-TW",
    ]);
    expect(result).toBe("en-US");
  });

  it("handles malformed q segment without '=' value", () => {
    const result = getLocaleFromAcceptLanguage("en;q, zh;q=0.5", ["en", "zh"]);
    expect(result).toBe("zh");
  });
});
