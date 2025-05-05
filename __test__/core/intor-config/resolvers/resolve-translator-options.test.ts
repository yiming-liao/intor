import type { InitTranslatorOptions } from "@/intor/core/intor-config/types/translator-options.types";
import { DEFAULT_TRANSLATOR_OPTIONS } from "@/intor/constants/translator-options.constants";
import { resolveTranslatorOptions } from "@/intor/core/intor-config/resolvers/resolve-translator-options";

describe("resolveTranslatorOptions", () => {
  it("should return default translator options if no input is provided", () => {
    expect(resolveTranslatorOptions()).toEqual(DEFAULT_TRANSLATOR_OPTIONS);
  });

  it("should merge custom translator options correctly", () => {
    const custom: InitTranslatorOptions = {
      placeholder: "123",
    };

    expect(resolveTranslatorOptions(custom)).toEqual({
      ...DEFAULT_TRANSLATOR_OPTIONS,
      ...custom,
    });
  });
});
