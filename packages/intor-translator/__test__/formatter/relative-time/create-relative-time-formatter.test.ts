import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRelativeTimeFormatter } from "../../../src/formatter/relative-time/create-relative-time-formatter";
import * as toCacheKeyModule from "../../../src/formatter/utils/to-cache-key";

vi.mock("../../../src/formatter/utils/to-cache-key");

describe("createRelativeTimeFormatter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates and caches a formatter on cache miss", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("en-US");

    const getFormatter = createRelativeTimeFormatter();
    const formatter = getFormatter("en-US");

    expect(formatter).toBeInstanceOf(Intl.RelativeTimeFormat);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledWith(
      "en-US",
      undefined,
    );
  });

  it("reuses the same formatter on cache hit", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("shared-key");

    const getFormatter = createRelativeTimeFormatter();

    const first = getFormatter("en-US", { numeric: "auto" });
    const second = getFormatter("en-US", { numeric: "auto" });

    expect(first).toBe(second);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledTimes(2);
  });

  it("creates a new formatter when the cache key changes", () => {
    vi.mocked(toCacheKeyModule.toCacheKey)
      .mockReturnValueOnce("en-US")
      .mockReturnValueOnce("de-DE");

    const getFormatter = createRelativeTimeFormatter();

    const first = getFormatter("en-US");
    const second = getFormatter("de-DE");

    expect(first).not.toBe(second);
  });
});
