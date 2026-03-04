import { describe, it, expect } from "vitest";
import { BaseTranslator } from "../../../src/translators/base-translator/base-translator";

describe("BaseTranslator", () => {
  const messages = {
    en: { hello: "Hello" },
    zh: { hello: "你好" },
  };

  it("should initialize with given messages and locale", () => {
    const translator = new BaseTranslator({
      messages,
      locale: "en",
      isLoading: true,
    });

    expect(translator.messages).toEqual(messages);
    expect(translator.locale).toBe("en");
    expect(translator.isLoading).toBe(true);
  });

  it("should default messages to empty object and isLoading to false if not provided", () => {
    const translator = new BaseTranslator({ locale: "en" });

    expect(translator.messages).toEqual({});
    expect(translator.locale).toBe("en");
    expect(translator.isLoading).toBe(false);
  });

  it("should update messages using setMessages", () => {
    const translator = new BaseTranslator({
      messages: { en: { hello: "" }, zh: { hello: "" } },
      locale: "en",
    });

    const newMessages = {
      en: { hello: "Hello Updated" },
      zh: { hello: "你好更新" },
    };

    translator.setMessages(newMessages);
    expect(translator.messages).toEqual(newMessages);
  });

  it("should update locale using setLocale", () => {
    const translator = new BaseTranslator({
      messages,
      locale: "en",
    });

    translator.setLocale("zh");
    expect(translator.locale).toBe("zh");
  });

  it("should update loading state using setLoading", () => {
    const translator = new BaseTranslator({
      messages,
      locale: "en",
      isLoading: false,
    });

    expect(translator.isLoading).toBe(false);

    translator.setLoading(true);
    expect(translator.isLoading).toBe(true);

    translator.setLoading(false);
    expect(translator.isLoading).toBe(false);
  });

  it("should allow overwriting messages of any compatible shape", () => {
    const translator = new BaseTranslator({
      messages,
      locale: "en",
    });

    const overrideMessages = {
      en: { hello: "Override" },
      zh: { hello: "覆蓋" },
    };

    translator.setMessages(overrideMessages);
    expect(translator.messages).toEqual(overrideMessages);
  });

  it("should update locale and loading state correctly", () => {
    const translator = new BaseTranslator({
      messages,
      locale: "en",
      isLoading: true,
    });

    translator.setLocale("zh");
    translator.setLoading(false);

    expect(translator.locale).toBe("zh");
    expect(translator.isLoading).toBe(false);
  });
});
