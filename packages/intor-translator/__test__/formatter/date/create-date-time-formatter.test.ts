import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDateTimeFormatter } from "../../../src/formatter/date/create-date-time-formatter";
import * as toCacheKeyModule from "../../../src/formatter/utils/to-cache-key";

vi.mock("../../../src/formatter/utils/to-cache-key");

describe("createDateTimeFormatter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates and caches a formatter on cache miss", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("en-US");

    const getFormatter = createDateTimeFormatter();
    const formatter = getFormatter("en-US");

    expect(formatter).toBeInstanceOf(Intl.DateTimeFormat);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledWith(
      "en-US",
      undefined,
    );
  });

  it("reuses the same formatter on cache hit", () => {
    vi.mocked(toCacheKeyModule.toCacheKey).mockReturnValue("shared-key");

    const getFormatter = createDateTimeFormatter();

    const first = getFormatter("en-US", { dateStyle: "long" });
    const second = getFormatter("en-US", { dateStyle: "long" });

    expect(first).toBe(second);
    expect(toCacheKeyModule.toCacheKey).toHaveBeenCalledTimes(2);
  });

  it("creates a new formatter when the cache key changes", () => {
    vi.mocked(toCacheKeyModule.toCacheKey)
      .mockReturnValueOnce("en-US")
      .mockReturnValueOnce("de-DE");

    const getFormatter = createDateTimeFormatter();

    const first = getFormatter("en-US");
    const second = getFormatter("de-DE");

    expect(first).not.toBe(second);
  });
});
