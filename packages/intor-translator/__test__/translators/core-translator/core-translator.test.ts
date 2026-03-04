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
});
