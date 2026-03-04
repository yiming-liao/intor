import type { IntorResolvedConfig } from "../../src/config";
import { describe, it, expect } from "vitest";
import {
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_ROUTING_OPTIONS,
} from "../../src/config";
import { getTranslator } from "../../src/server/helpers/get-translator";

describe("getTranslator (smoke)", () => {
  const config: IntorResolvedConfig = {
    id: "test",
    defaultLocale: "en-US",
    supportedLocales: ["en-US"],
    fallbackLocales: {},
    messages: {
      "en-US": {
        hello: "{name}",
        rich: "<a>Link</a>",
      },
    },
    cookie: DEFAULT_COOKIE_OPTIONS,
    routing: DEFAULT_ROUTING_OPTIONS,
    logger: { id: "test" },
  };

  it("creates a usable translator snapshot", async () => {
    const translator = await getTranslator(config, { locale: "en-US" });

    expect(translator.locale).toBe("en-US");
    expect(translator.t("hello")).toBe("{name}");
    expect(translator.t("hello", { name: "Intor" })).toBe("Intor");
    expect(translator.hasKey("hello")).toBe(true);
    expect(translator.hasKey("missing")).toBe(false);
    expect(translator.tRich("rich", { a: (c) => `<b>${c}</b>` })).toBe(
      "<b>Link</b>",
    );
  });
});
