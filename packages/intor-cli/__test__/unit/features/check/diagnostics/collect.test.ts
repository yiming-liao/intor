/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtractedUsages } from "../../../../../src/core/extract-usages";
import type { Diagnostic } from "../../../../../src/features/check/diagnostics/types";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectDiagnostics } from "../../../../../src/features/check/diagnostics";
import { enforceMissingReplacements } from "../../../../../src/features/check/diagnostics/rules/enforce-missing-replacements";
import { enforceMissingRich } from "../../../../../src/features/check/diagnostics/rules/enforce-missing-rich";
import {
  keyEmpty,
  keyNotExist,
} from "../../../../../src/features/check/diagnostics/rules/key";
import { preKeyNotExist } from "../../../../../src/features/check/diagnostics/rules/pre-key";
import {
  replacementMissing,
  replacementsNotAllowed,
  replacementUnexpected,
} from "../../../../../src/features/check/diagnostics/rules/replacement";
import {
  richMissing,
  richNotAllowed,
  richUnexpected,
} from "../../../../../src/features/check/diagnostics/rules/rich";

vi.mock("../../../../../src/features/check/diagnostics/rules/pre-key", () => ({
  preKeyNotExist: vi.fn(),
}));

vi.mock("../../../../../src/features/check/diagnostics/rules/key", () => ({
  keyNotExist: vi.fn(),
  keyEmpty: vi.fn(),
}));

vi.mock(
  "../../../../../src/features/check/diagnostics/rules/replacement",
  () => ({
    replacementsNotAllowed: vi.fn(),
    replacementMissing: vi.fn(),
    replacementUnexpected: vi.fn(),
  }),
);

vi.mock("../../../../../src/features/check/diagnostics/rules/rich", () => ({
  richNotAllowed: vi.fn(),
  richMissing: vi.fn(),
  richUnexpected: vi.fn(),
}));

vi.mock(
  "../../../../../src/features/check/diagnostics/rules/enforce-missing-replacements",
  () => ({
    enforceMissingReplacements: vi.fn(),
  }),
);

vi.mock(
  "../../../../../src/features/check/diagnostics/rules/enforce-missing-rich",
  () => ({
    enforceMissingRich: vi.fn(),
  }),
);

vi.mock(
  "../../../../../src/features/check/diagnostics/utils/index-usages-by-key",
  () => ({
    indexUsagesByKey: vi.fn(() => new Map()),
  }),
);

describe("collectDiagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects diagnostics from all rule groups, but enforces only on t / tRich", () => {
    const d = (id: string): Diagnostic => ({ id }) as any;
    vi.mocked(preKeyNotExist).mockReturnValue([d("preKey")]);
    vi.mocked(keyNotExist).mockReturnValue([d("keyNotExist")]);
    vi.mocked(keyEmpty).mockReturnValue([d("keyEmpty")]);
    vi.mocked(replacementsNotAllowed).mockReturnValue([d("repNotAllowed")]);
    vi.mocked(replacementMissing).mockReturnValue([d("repMissing")]);
    vi.mocked(replacementUnexpected).mockReturnValue([d("repUnexpected")]);
    vi.mocked(richNotAllowed).mockReturnValue([d("richNotAllowed")]);
    vi.mocked(richMissing).mockReturnValue([d("richMissing")]);
    vi.mocked(richUnexpected).mockReturnValue([d("richUnexpected")]);
    vi.mocked(enforceMissingReplacements).mockReturnValue([d("enforceRep")]);
    vi.mocked(enforceMissingRich).mockReturnValue([d("enforceRich")]);
    const usages: ExtractedUsages = {
      preKey: [{} as any],
      key: [{ method: "t" } as any],
      trans: [{ key: "home.title" } as any],
      replacement: [{} as any],
      rich: [{} as any],
    };
    const result = collectDiagnostics(
      {
        messages: {} as any,
        replacements: {} as any,
        rich: {} as any,
      },
      usages,
    );
    expect(result.map((d) => (d as any).id)).toEqual([
      // key-level rules: t
      "keyNotExist",
      "keyEmpty",
      // key-level rules: <Trans />
      "keyNotExist",
      "keyEmpty",
      // preKey
      "preKey",
      // replacement
      "repNotAllowed",
      "repMissing",
      "repUnexpected",
      // rich
      "richNotAllowed",
      "richMissing",
      "richUnexpected",
      // enforce (ONLY once, for t)
      "enforceRep",
      "enforceRich",
    ]);
  });

  it("does not call enforce rules when there are no t / tRich usages", () => {
    const usages: ExtractedUsages = {
      preKey: [],
      key: [],
      trans: [{ key: "home.title" } as any],
      replacement: [],
      rich: [],
    };
    collectDiagnostics(
      {
        messages: {} as any,
        replacements: {} as any,
        rich: {} as any,
      },
      usages,
    );
    expect(enforceMissingReplacements).not.toHaveBeenCalled();
    expect(enforceMissingRich).not.toHaveBeenCalled();
  });
});
