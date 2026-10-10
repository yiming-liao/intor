import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { createIntorHandler } from "../../src/adapters/next/create-intor-handler";
import { INTOR_HEADER_KEYS } from "../../src/adapters/next/header-keys";
import { defineIntorConfig } from "../../src/config/define-intor-config";
import { resolveInboundFromRequest } from "../../src/routing/inbound/helpers/resolve-inbound-from-request";

const config = defineIntorConfig({
  supportedLocales: ["fr", "en"],
  defaultLocale: "fr",
  routing: { localePrefix: "all" },
  cookie: { enabled: true, name: "lang" },
});

describe("Accept-Language through request routing", () => {
  it.each(["fr;q=2,en;q=0.5", "en;q=0.5,fr;q=2"])(
    "retains a valid candidate around malformed entries: %s",
    (header) => {
      expect(
        resolveInboundFromRequest(
          config,
          new Request("https://example.test/", {
            headers: { "accept-language": header },
          }),
        ),
      ).toEqual({ locale: "en", localeSource: "detected", pathname: "/en" });
    },
  );

  it.each([
    ["en;q=2", "fr", "default"],
    ["fr;q=2,en;q=0.5", "en", "detected"],
    ["en;Q=1.000", "en", "detected"],
  ])("produces a real Next redirect for %s", (header, locale, source) => {
    const response = createIntorHandler(config)(
      new NextRequest("https://example.test/", {
        headers: { "accept-language": header },
      }),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `https://example.test/${locale}`,
    );
    expect(response.headers.get(INTOR_HEADER_KEYS.LOCALE)).toBe(locale);
    expect(response.headers.get(INTOR_HEADER_KEYS.LOCALE_SOURCE)).toBe(source);
  });

  it.each(["en;q=0", "en;q=oops", "en;q=2", "en;q=0.9oops", "en;q=0.9;q=0"])(
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
