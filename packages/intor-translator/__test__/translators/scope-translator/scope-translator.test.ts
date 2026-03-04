/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as hasKeyModule from "../../../src/translators/methods/has-key";
import * as translateModule from "../../../src/translators/methods/translate";
import { ScopeTranslator } from "../../../src/translators/scope-translator/scope-translator";
import * as getFullKeyModule from "../../../src/translators/scope-translator/utils/get-full-key";

vi.mock("../../../src/translators/scope-translator/utils/get-full-key");
vi.mock("../../../src/translators/methods/has-key");
vi.mock("../../../src/translators/methods/translate");

describe("ScopeTranslator", () => {
  const messages = { en: { hello: "Hello", nested: { greet: "Hi" } } };
  const locale = "en";
  let translator: ScopeTranslator<typeof messages>;

  beforeEach(() => {
    vi.resetAllMocks();
    translator = new ScopeTranslator({ messages, locale });
  });

  it("returns scoped translator with hasKey and t", () => {
    const scoped = translator.scoped("nested");
    expect(typeof scoped.hasKey).toBe("function");
    expect(typeof scoped.t).toBe("function");
  });

  it("scoped.hasKey prefixes key correctly", () => {
    const scoped = translator.scoped("nested");
    vi.mocked(getFullKeyModule.getFullKey).mockReturnValue("nested.greet");
    vi.mocked(hasKeyModule.hasKey).mockReturnValue(true);
    const result = scoped.hasKey("greet", "en");
    expect(result).toBe(true);
    expect(getFullKeyModule.getFullKey).toHaveBeenCalledWith("nested", "greet");
    expect(hasKeyModule.hasKey).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "nested.greet",
        targetLocale: "en",
      }),
    );
  });

  it("scoped.t prefixes key and delegates to translate()", () => {
    const scoped = translator.scoped("nested");
    vi.mocked(getFullKeyModule.getFullKey).mockReturnValue("nested.greet");
    vi.mocked(translateModule.translate).mockReturnValue("Hi!");
    const result = scoped.t("greet", { name: "Yiming" });
    expect(result).toBe("Hi!");
    expect(getFullKeyModule.getFullKey).toHaveBeenCalledWith("nested", "greet");
    expect(translateModule.translate).toHaveBeenCalled();
    const [, context] = vi.mocked(translateModule.translate).mock
      .calls[0] as any;
    expect(context.key).toBe("nested.greet");
    expect(context.replacements).toEqual({ name: "Yiming" });
  });

  it("scoped works without preKey", () => {
    const scoped = translator.scoped();
    vi.mocked(getFullKeyModule.getFullKey).mockReturnValue("hello");
    vi.mocked(hasKeyModule.hasKey).mockReturnValue(true);
    vi.mocked(translateModule.translate).mockReturnValue("Hello!");
    expect(scoped.hasKey("hello")).toBe(true);
    expect(scoped.t("hello")).toBe("Hello!");
  });
});
