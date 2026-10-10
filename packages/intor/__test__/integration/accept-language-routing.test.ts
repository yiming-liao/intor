import { describe, expect, it } from "vitest";
import { defineIntorConfig } from "../../src/config/define-intor-config";
import { resolveInboundFromRequest } from "../../src/routing/inbound/helpers/resolve-inbound-from-request";

const config = defineIntorConfig({
  supportedLocales: ["fr", "en"],
  defaultLocale: "fr",
  routing: { localePrefix: "all" },
  cookie: { enabled: true, name: "lang" },
});

describe("Accept-Language through request routing", () => {
  it.each(["en;q=0", "en;q=oops"])(
    "uses the default when %s provides no acceptable candidate",
    (header) => {
      const result = resolveInboundFromRequest(
        config,
        new Request("https://example.test/", {
          headers: { "accept-language": header },
        }),
      );
      expect(result).toEqual({
        locale: "fr",
        localeSource: "default",
        pathname: "/fr",
      });
    },
  );

  it("retains positive-weight detection", () => {
    expect(
      resolveInboundFromRequest(
        config,
        new Request("https://example.test/", {
          headers: { "accept-language": "en;q=0.8" },
        }),
      ),
    ).toEqual({ locale: "en", localeSource: "detected", pathname: "/en" });
  });

  it.each(["path", "cookie"])(
    "keeps explicit %s preferences ahead of detection",
    (source) => {
      const result = resolveInboundFromRequest(
        config,
        new Request(
          source === "path"
            ? "https://example.test/fr"
            : "https://example.test/",
          {
            headers: {
              "accept-language": "en;q=0.8",
              ...(source === "cookie" ? { cookie: "lang=fr" } : {}),
            },
          },
        ),
      );
      expect(result).toEqual({
        locale: "fr",
        localeSource: source,
        pathname: "/fr",
      });
    },
  );
});
