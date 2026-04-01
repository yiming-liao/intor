/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CoreTranslator } from "../../../src/translators/core-translator/core-translator";
import * as hasKeyModule from "../../../src/translators/methods/has-key";
import * as translateModule from "../../../src/translators/methods/translate";

vi.mock("../../../src/translators/methods/has-key");
vi.mock("../../../src/translators/methods/translate");

describe("CoreTranslator", () => {
  const messages = { en: { hello: "Hello" } };
  const locale = "en";

  let translator: CoreTranslator<typeof messages>;

  beforeEach(() => {
    vi.resetAllMocks();
    translator = new CoreTranslator({ messages, locale });
  });

  it("initializes with provided state", () => {
    expect(translator).toBeInstanceOf(CoreTranslator);
  });

  it("delegates hasKey to method module", () => {
    const spy = vi.mocked(hasKeyModule.hasKey).mockReturnValue(true);
    const result = translator.hasKey("hello");
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("delegates translation to translate()", () => {
    const spy = vi.mocked(translateModule.translate).mockReturnValue("Hello");
    const result = translator.t("hello");
    expect(result).toBe("Hello");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("passes replacements to translate()", () => {
    const spy = vi
      .mocked(translateModule.translate)
      .mockReturnValue("Hello Yiming");
    const replacements = { name: "Yiming" };
    translator.t("hello", replacements);
    const [, context] = spy.mock.calls[0] as any;
    expect(context.replacements).toEqual(replacements);
  });

  it("registers hooks via use()", () => {
    const hook = { run: vi.fn() } as any;
    expect(() => translator.use(hook)).not.toThrow();
  });

  it("logHooks() does not throw", () => {
    expect(() => translator.logHooks()).not.toThrow();
  });

  it("getHooks() returns an array", () => {
    const hooks = translator.getHooks();
    expect(Array.isArray(hooks)).toBe(true);
  });

  it("passes isLoading=false correctly", () => {
    const t = new CoreTranslator({
      messages,
      locale,
      isLoading: false,
    });
    expect(t["_isLoading"]).toBe(false);
  });

  it("registers constructor hooks", () => {
    const hook = { run: vi.fn() } as any;
    const t = new CoreTranslator({
      messages,
      locale,
      hooks: [hook],
    });
    expect(t.getHooks()).toContain(hook);
  });

  it("calls hasKey with targetLocale", () => {
    translator.hasKey("hello", "zh" as any);
    expect(hasKeyModule.hasKey).toHaveBeenCalledWith(
      expect.objectContaining({
        targetLocale: "zh",
      }),
    );
  });

  it("exposes locale-aware formatting helpers", () => {
    expect(translator.format.number(1000)).toBe("1,000");
    expect(translator.format.currency(1000, "USD")).toBe("$1,000.00");
    expect(translator.format.displayName("US", { type: "region" })).toBe(
      "United States",
    );
    expect(translator.format.plural(1)).toBe("one");
  });

  it("keeps format helpers in sync with locale updates", () => {
    translator.setLocale("de-DE" as any);

    expect(translator.format.number(1000)).toBe("1.000");
  });

  it("applies formatDefaults to formatter helpers", () => {
    const t = new CoreTranslator({
      messages,
      locale,
      formatDefaults: {
        timeZone: "UTC",
        number: { maximumFractionDigits: 1 },
        date: { dateStyle: "long" },
        currencyCode: "USD",
        currency: { maximumFractionDigits: 0 },
        displayName: { type: "language", languageDisplay: "dialect" },
        plural: { type: "ordinal" },
      },
    });

    expect(t.format.number(12345.67)).toBe("12,345.7");
    expect(t.format.currency(499.9)).toBe("$500");
    expect(t.format.date(new Date("2026-04-01T00:00:00.000Z"))).toBe(
      "April 1, 2026",
    );
    expect(t.format.displayName("en-US")).toBe("American English");
    expect(t.format.plural(2)).toBe("two");
  });
});
