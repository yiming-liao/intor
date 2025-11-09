import { LocaleNamespaceMessages } from "intor-translator";
import { mergeMessages } from "@/shared/utils/merge-messages";

describe("mergeMessages", () => {
  it("merges static and loaded messages with no overlap", () => {
    const staticMessages: LocaleNamespaceMessages = {
      en: { common: { hello: "Hello" } },
    };

    const loadedMessages: LocaleNamespaceMessages = {
      zh: { common: { hello: "你好" } },
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: { common: { hello: "Hello" } },
      zh: { common: { hello: "你好" } },
    });
  });

  it("overrides static messages with loaded messages", () => {
    const staticMessages: LocaleNamespaceMessages = {
      en: {
        common: { hello: "Hello" },
        homepage: { title: "Welcome" },
      },
    };

    const loadedMessages: LocaleNamespaceMessages = {
      en: {
        common: { hello: "Hi" },
        footer: { contact: "Contact Us" },
      },
    };

    const result = mergeMessages(staticMessages, loadedMessages);

    expect(result).toEqual({
      en: {
        common: { hello: "Hi" },
        homepage: { title: "Welcome" },
        footer: { contact: "Contact Us" },
      },
    });
  });

  it("returns only loaded messages if static is empty", () => {
    const result = mergeMessages(
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
    const result = mergeMessages({}, {});
    expect(result).toEqual({});
  });
});
