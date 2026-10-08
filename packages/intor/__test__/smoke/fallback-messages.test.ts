import { describe, expect, it, vi } from "vitest";
import { createRefetchMessages } from "../../src/client/shared/messages/create-refetch-messages";
import { defineIntorConfig } from "../../src/config";
import { createTranslator } from "../../src/core/translator/create-translator";
import { initTranslator } from "../../src/server/translator/init-translator";

describe("loaded fallback messages", () => {
  const config = defineIntorConfig({
    id: "fallback-test",
    defaultLocale: "en-US",
    supportedLocales: ["fr", "en-US"],
    fallbackLocales: { fr: ["en-US"] },
    loader: { mode: "local", rootDir: "__test__/mocks/messages" },
  });

  it("preserves a local fallback and keeps the requested locale", async () => {
    const translator = await initTranslator(config, "fr", {
      fetch: globalThis.fetch,
    });
    expect(translator.locale).toBe("fr");
    expect(translator.t("hello")).toBe("world");
    expect(translator.messages["en-US"]).toBeDefined();
  });

  it("merges loaded fallback overrides without dropping static keys", () => {
    const translator = createTranslator({
      config: {
        ...config,
        messages: {
          "en-US": { hello: "static", retained: "keep" },
          fr: { primary: "bonjour" },
        },
      },
      locale: "fr",
      messages: { "en-US": { hello: "loaded" } },
    });
    expect(translator.t("hello")).toBe("loaded");
    expect(translator.t("retained")).toBe("keep");
    expect(translator.t("primary")).toBe("bonjour");
  });

  it("preserves remote fallback messages during client refetch", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(Response.json({ hello: "remote" }));
    vi.stubGlobal("fetch", fetchMock);
    try {
      const onMessages = vi.fn();
      await createRefetchMessages({
        config: {
          ...config,
          loader: { mode: "remote", url: "https://messages.test" },
        },
        onMessages,
      })("fr");
      expect(onMessages).toHaveBeenCalledWith({
        fr: {},
        "en-US": { hello: "remote" },
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
