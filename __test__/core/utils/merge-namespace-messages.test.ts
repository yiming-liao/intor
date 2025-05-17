import type { LocaleNamespaceMessages } from "../../../src/intor/types/message-structure-types";
import { mergeStaticAndDynamicMessages } from "../../../src/intor/core/utils/merge-static-and-dynamic-messages";

describe("mergeStaticAndDynamicMessages", () => {
  it("merges static and dynamic messages with no overlap", () => {
    const staticMessages: LocaleNamespaceMessages = {
      en: { common: { hello: "Hello" } },
    };

    const dynamicMessages: LocaleNamespaceMessages = {
      zh: { common: { hello: "你好" } },
    };

    const result = mergeStaticAndDynamicMessages(
      staticMessages,
      dynamicMessages,
    );

    expect(result).toEqual({
      en: { common: { hello: "Hello" } },
      zh: { common: { hello: "你好" } },
    });
  });

  it("overrides static messages with dynamic messages", () => {
    const staticMessages: LocaleNamespaceMessages = {
      en: {
        common: { hello: "Hello" },
        homepage: { title: "Welcome" },
      },
    };

    const dynamicMessages: LocaleNamespaceMessages = {
      en: {
        common: { hello: "Hi" },
        footer: { contact: "Contact Us" },
      },
    };

    const result = mergeStaticAndDynamicMessages(
      staticMessages,
      dynamicMessages,
    );

    expect(result).toEqual({
      en: {
        common: { hello: "Hi" },
        homepage: { title: "Welcome" },
        footer: { contact: "Contact Us" },
      },
    });
  });

  it("returns only dynamic messages if static is empty", () => {
    const result = mergeStaticAndDynamicMessages(
      {},
      {
        ja: {
          common: { hello: "こんにちは" },
        },
      },
    );

    expect(result).toEqual({
      ja: { common: { hello: "こんにちは" } },
    });
  });

  it("returns empty object if both inputs are empty", () => {
    const result = mergeStaticAndDynamicMessages({}, {});
    expect(result).toEqual({});
  });
});
