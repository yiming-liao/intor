import type { FormatHandler } from "../../../src/pipeline";
import type { LocaleMessages, MessageValue } from "../../../src/types";
import { describe, expect, it, vi } from "vitest";
import { CoreTranslator } from "../../../src/translators/core-translator/core-translator";

describe("formatHandler message value input contract", () => {
  it.each<MessageValue>([
    42,
    true,
    false,
    null,
    ["hello", 7],
    { label: "hello" },
  ])(
    "passes non-string message %j to a handler that narrows its input",
    (message) => {
      const handler: FormatHandler = ({ rawMessage }) =>
        typeof rawMessage === "string" ? rawMessage.toUpperCase() : rawMessage;
      const formatHandler = vi.fn(handler);
      const translator = new CoreTranslator<LocaleMessages>({
        locale: "en",
        messages: { en: { value: message, text: "hello" } },
        handlers: { formatHandler },
      });
      expect(translator.t("value", { name: "Alice" })).toEqual(message);
      expect(formatHandler.mock.calls[0]?.[0].rawMessage).toEqual(message);
      expect(translator.t("text", { name: "Alice" })).toBe("HELLO");
      expect(formatHandler).toHaveBeenCalledTimes(2);
    },
  );

  it("allows converting a non-string message", () => {
    const translator = new CoreTranslator<LocaleMessages>({
      locale: "en",
      messages: { en: { value: 42 } },
      handlers: { formatHandler: ({ rawMessage }) => `Value: ${rawMessage}` },
    });
    expect(translator.t("value")).toBe("Value: 42");
  });

  it("continues to interpolate string formatter output", () => {
    const translator = new CoreTranslator<LocaleMessages>({
      locale: "en",
      messages: { en: { value: "hello" } },
      handlers: { formatHandler: ({ rawMessage }) => `${rawMessage}, {name}!` },
    });
    expect(translator.t("value", { name: "Alice" })).toBe("hello, Alice!");
  });

  it.each<MessageValue>([
    null,
    0,
    "",
    42,
    false,
    ["formatted"],
    { label: "formatted" },
  ])("preserves formatter output %j", (output) => {
    const translator = new CoreTranslator<LocaleMessages>({
      locale: "en",
      messages: { en: { value: "hello" } },
      handlers: { formatHandler: () => output },
    });
    expect(translator.t("value")).toEqual(output);
  });
});
