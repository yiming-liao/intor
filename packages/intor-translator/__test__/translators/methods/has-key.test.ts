import { describe, it, expect, vi, beforeEach } from "vitest";
import { findMessageInLocales } from "../../../src/shared/utils/find-message-in-locales";
import { resolveCandidateLocales } from "../../../src/shared/utils/resolve-candidate-locales";
import { hasKey } from "../../../src/translators/methods/has-key";

// mock utils
vi.mock("../../../src/shared/utils/find-message-in-locales");
vi.mock("../../../src/shared/utils/resolve-candidate-locales");

describe("hasKey", () => {
  const messages = {
    en: { hello: "world" },
    zh: { hello: "世界" },
  };
  const locale = "en";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return true if key exists in messages", () => {
    vi.mocked(resolveCandidateLocales).mockReturnValue(["en"]);
    vi.mocked(findMessageInLocales).mockReturnValue("world");

    const result = hasKey({
      messages,
      locale,
      key: "hello",
    });
    expect(result).toBe(true);
  });

  it("should return false if key does not exist", () => {
    vi.mocked(resolveCandidateLocales).mockReturnValue(["en"]);
    vi.mocked(findMessageInLocales).mockReturnValue(undefined);

    const result = hasKey({
      messages,
      locale,
      key: "missing",
    });
    expect(result).toBe(false);
  });

  it("should use targetLocale if provided", () => {
    vi.mocked(resolveCandidateLocales).mockReturnValue(["zh"]);
    vi.mocked(findMessageInLocales).mockReturnValue("世界");

    const result = hasKey({
      messages,
      locale,
      key: "hello",
      targetLocale: "zh",
    });
    expect(result).toBe(true);
  });

  it("should return true for existing key with falsy value", () => {
    vi.mocked(resolveCandidateLocales).mockReturnValue(["en"]);
    vi.mocked(findMessageInLocales).mockReturnValue(0); // or false / null

    const result = hasKey({
      messages,
      locale,
      key: "count",
    });

    expect(result).toBe(true);
  });
});
