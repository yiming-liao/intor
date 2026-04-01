import { describe, expect, it } from "vitest";
import { toCacheKey } from "../../../src/formatter/utils/to-cache-key";

describe("toCacheKey", () => {
  it("returns the locale when options are undefined", () => {
    expect(toCacheKey("en-US")).toBe("en-US");
  });

  it("returns the locale when options are empty", () => {
    expect(toCacheKey("en-US", {})).toBe("en-US");
  });

  it("sorts option keys and omits undefined values", () => {
    expect(
      toCacheKey("en-US", {
        useGrouping: true,
        currency: "USD",
        style: "currency",
        minimumFractionDigits: undefined,
      }),
    ).toBe("en-US__currency:USD|style:currency|useGrouping:true");
  });
});
