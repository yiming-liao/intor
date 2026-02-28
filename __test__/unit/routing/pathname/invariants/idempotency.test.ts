import { describe, it, expect } from "vitest";
import { localizePathname } from "../../../../../src/routing/pathname/localize-pathname";

describe("localizePathname idempotency", () => {
  const config = {
    defaultLocale: "en",
    supportedLocales: ["en", "zh"],
    routing: {
      basePath: "/app",
      localePrefix: "all",
    },
  } as any;

  const samples = ["/app/en/about", "/app/about", "/app", "/"];

  for (const raw of samples) {
    it(`is idempotent for: ${raw}`, () => {
      const first = localizePathname(raw, config, "zh");
      const second = localizePathname(first.pathname, config, "zh");

      expect(second).toEqual(first);
    });
  }
});
