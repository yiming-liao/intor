import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveLocales } from "../../../src/pipeline/hooks/resolve-locales";
import { type TranslateContext } from "../../../src/pipeline/types/context";
import * as localeUtil from "../../../src/shared/utils/resolve-candidate-locales";

describe("resolveLocalesHook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should call resolveCandidateLocales with correct arguments", () => {
    const mockReturn = ["a", "b", "c"];
    const spy = vi
      .spyOn(localeUtil, "resolveCandidateLocales")
      .mockReturnValue(mockReturn);

    const ctx = {
      locale: "zh-TW",
      config: { fallbackLocales: ["zh"] },
      candidateLocales: [],
    } as unknown as TranslateContext;

    resolveLocales.run(ctx);

    expect(spy).toHaveBeenCalledWith("zh-TW", ["zh"]);
    expect(ctx.candidateLocales).toBe(mockReturn);
  });
});
