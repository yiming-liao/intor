import { describe, it, expect } from "vitest";
import { mergeMessages } from "@/shared/utils";

describe("mergeMessages", () => {
  it("should merge messages with loaded overriding static", () => {
    const staticMessages = {
      en: { ui: { hello: "Hello", bye: "Bye" } },
      zh: { ui: { hello: "哈囉" } },
    };
    const loadedMessages = {
      en: { ui: { hello: "Hi" } },
      fr: { ui: { hello: "Bonjour" } },
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: { ui: { hello: "Hi", bye: "Bye" } },
      zh: { ui: { hello: "哈囉" } },
      fr: { ui: { hello: "Bonjour" } },
    });
  });

  it("should return staticMessages if loadedMessages is undefined", () => {
    const staticMessages = {
      en: { ui: { hello: "Hello" } },
    };

    const result = mergeMessages(staticMessages);

    expect(result).toEqual(staticMessages);
  });

  it("should return loadedMessages if staticMessages is empty", () => {
    const loadedMessages = {
      en: { ui: { hello: "Hi" } },
    };

    const result = mergeMessages({}, loadedMessages);

    expect(result).toEqual(loadedMessages);
  });

  it("should return empty object if both are empty", () => {
    const result = mergeMessages({}, {});
    expect(result).toEqual({});
  });
});
