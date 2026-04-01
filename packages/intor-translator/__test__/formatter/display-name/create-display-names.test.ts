import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDisplayNames } from "../../../src/formatter/display-name/create-display-names";
import * as toCacheKeyModule from "../../../src/formatter/utils/to-cache-key";

vi.mock("../../../src/formatter/utils/to-cache-key");

describe("createDisplayNames", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates and caches display names on cache miss", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("en-US");

    const getDisplayNames = createDisplayNames();
    const displayNames = getDisplayNames("en-US", { type: "region" });

    expect(displayNames).toBeInstanceOf(Intl.DisplayNames);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledWith("en-US", {
      type: "region",
    });
  });

  it("reuses the same display names on cache hit", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("shared-key");

    const getDisplayNames = createDisplayNames();

    const first = getDisplayNames("en-US", {
      type: "language",
      languageDisplay: "dialect",
    });
    const second = getDisplayNames("en-US", {
      type: "language",
      languageDisplay: "dialect",
    });

    expect(first).toBe(second);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledTimes(2);
  });

  it("creates new display names when the cache key changes", () => {
    vi.mocked(toCacheKeyModule.toCacheKey)
      .mockReturnValueOnce("en-US")
      .mockReturnValueOnce("de-DE");

    const getDisplayNames = createDisplayNames();

    const first = getDisplayNames("en-US", { type: "region" });
    const second = getDisplayNames("de-DE", { type: "region" });

    expect(first).not.toBe(second);
  });
});
