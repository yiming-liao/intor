import type { LocaleMessages } from "intor-translator";
import { describe, it, expect } from "vitest";
import { mergeMessages } from "@/shared/utils";

describe("mergeMessages", () => {
  it("should return an empty object when both inputs are empty", () => {
    const result = mergeMessages();
    expect(result).toEqual({});
  });

  it("should return static messages when loaded messages are empty", () => {
    const staticMessages: LocaleMessages = {
      en: { common: { hello: "Hello" } },
    };

    const result = mergeMessages(staticMessages, {});
    expect(result).toEqual(staticMessages);
  });

  it("should merge loaded messages and override static ones on conflict", () => {
    const staticMessages: LocaleMessages = {
      en: { common: { hello: "Hello" }, nav: { home: "Home" } },
    };

    const loadedMessages: LocaleMessages = {
      en: { common: { hello: "Hi" } }, // override
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: {
        common: { hello: "Hi" },
        nav: { home: "Home" },
      },
    });
  });

  it("should add new locales from loaded messages when static does not contain them", () => {
    const staticMessages: LocaleMessages = {
      en: { common: { hello: "Hello" } },
    };

    const loadedMessages: LocaleMessages = {
      zh: { common: { hello: "哈囉" } },
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: { common: { hello: "Hello" } },
      zh: { common: { hello: "哈囉" } },
    });
  });

  it("should merge namespaces when both static and loaded have multiple keys", () => {
    const staticMessages: LocaleMessages = {
      en: {
        common: { a: "1" },
        nav: { b: "2" },
      },
    };

    const loadedMessages: LocaleMessages = {
      en: {
        nav: { b: "B" },
        footer: { c: "3" },
      },
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: {
        common: { a: "1" },
        nav: { b: "B" },
        footer: { c: "3" },
      },
    });
  });

  it("should initialize result correctly when staticMessages is empty but loaded is not", () => {
    const result = mergeMessages({}, { en: { common: { hi: "Hello" } } });

    expect(result).toEqual({
      en: { common: { hi: "Hello" } },
    });
  });
});
