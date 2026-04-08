import { describe, it, expect } from "vitest";
import { collectDiagnostics, groupDiagnostics } from "../../../../../src/features/check/diagnostics";
import { keyEmpty, keyNotExist } from "../../../../../src/features/check/diagnostics/rules/key";
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

describe("diagnostics exports", () => {
  it("re-exports the diagnostics entry points", async () => {
    const mod = await import("../../../../../src/features/check/diagnostics");

    expect(mod.collectDiagnostics).toBe(collectDiagnostics);
    expect(mod.groupDiagnostics).toBe(groupDiagnostics);
  });

  it("re-exports key rules", async () => {
    const mod = await import(
      "../../../../../src/features/check/diagnostics/rules/key"
    );

    expect(mod.keyNotExist).toBe(keyNotExist);
    expect(mod.keyEmpty).toBe(keyEmpty);
  });

  it("re-exports the preKey rules", async () => {
    const mod = await import(
      "../../../../../src/features/check/diagnostics/rules/pre-key"
    );

    expect(mod.preKeyNotExist).toBe(preKeyNotExist);
  });

  it("re-exports replacement rules", async () => {
    const mod = await import(
      "../../../../../src/features/check/diagnostics/rules/replacement"
    );

    expect(mod.replacementsNotAllowed).toBe(replacementsNotAllowed);
    expect(mod.replacementMissing).toBe(replacementMissing);
    expect(mod.replacementUnexpected).toBe(replacementUnexpected);
  });

  it("re-exports rich rules", async () => {
    const mod = await import(
      "../../../../../src/features/check/diagnostics/rules/rich"
    );

    expect(mod.richNotAllowed).toBe(richNotAllowed);
    expect(mod.richMissing).toBe(richMissing);
    expect(mod.richUnexpected).toBe(richUnexpected);
  });
});
