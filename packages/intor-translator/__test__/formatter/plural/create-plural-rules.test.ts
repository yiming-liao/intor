import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPluralRules } from "../../../src/formatter/plural/create-plural-rules";
import * as toCacheKeyModule from "../../../src/formatter/utils/to-cache-key";

vi.mock("../../../src/formatter/utils/to-cache-key");

describe("createPluralRules", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates and caches plural rules on cache miss", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("en-US");

    const getRules = createPluralRules();
    const rules = getRules("en-US");

    expect(rules).toBeInstanceOf(Intl.PluralRules);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledWith(
      "en-US",
      undefined,
    );
  });

  it("reuses the same plural rules on cache hit", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("shared-key");

    const getRules = createPluralRules();

    const first = getRules("en-US", { type: "ordinal" });
    const second = getRules("en-US", { type: "ordinal" });

    expect(first).toBe(second);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledTimes(2);
  });

  it("creates new plural rules when the cache key changes", () => {
    vi.mocked(toCacheKeyModule.toCacheKey)
      .mockReturnValueOnce("en-US")
      .mockReturnValueOnce("ar-EG");

    const getRules = createPluralRules();

    const first = getRules("en-US");
    const second = getRules("ar-EG");

    expect(first).not.toBe(second);
  });
});
