/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SourceFile } from "ts-morph";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  collectTranslatorBindings,
  collectKeyUsages,
  collectReplacementUsages,
  collectRichUsages,
  collectPreKeys,
  collectTransUsages,
} from "../../../../src/core/extract-usages/collectors";
import { extractUsagesFromSourceFile } from "../../../../src/core/extract-usages/extract-usages-from-source-file";

vi.mock("../../../../src/core/extract-usages/collectors", () => ({
  collectTranslatorBindings: vi.fn(),
  collectKeyUsages: vi.fn(),
  collectReplacementUsages: vi.fn(),
  collectRichUsages: vi.fn(),
  collectPreKeys: vi.fn(),
  collectTransUsages: vi.fn(),
}));

const mockSourceFile = {} as SourceFile;

const usage = (localName: string) => ({ localName }) as any;

describe("extractUsagesFromSourceFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns only trans usages when no translator bindings exist", () => {
    (collectTranslatorBindings as any).mockReturnValue(new Map());
    (collectTransUsages as any).mockReturnValue([{ key: "home.title" }]);
    const result = extractUsagesFromSourceFile(mockSourceFile);
    expect(result).toEqual({
      preKey: [],
      key: [],
      replacement: [],
      rich: [],
      trans: [{ key: "home.title" }],
    });
    expect(collectKeyUsages).not.toHaveBeenCalled();
    expect(collectReplacementUsages).not.toHaveBeenCalled();
    expect(collectRichUsages).not.toHaveBeenCalled();
    expect(collectPreKeys).not.toHaveBeenCalled();
  });

  it("collects usages and attaches preKey to all usage types", () => {
    const bindingMap = new Map([["t", {}]]);
    const preKeyMap = new Map([["t", "home"]]);
    const keyUsages = [usage("t")];
    const replacementUsages = [usage("t")];
    const richUsages = [usage("t")];
    const preKeyUsages = [{ localName: "t", preKey: "home" }];
    (collectTranslatorBindings as any).mockReturnValue(bindingMap);
    (collectKeyUsages as any).mockReturnValue(keyUsages);
    (collectReplacementUsages as any).mockReturnValue(replacementUsages);
    (collectRichUsages as any).mockReturnValue(richUsages);
    (collectPreKeys as any).mockReturnValue({
      preKeyMap,
      usages: preKeyUsages,
    });
    (collectTransUsages as any).mockReturnValue([]);
    const result = extractUsagesFromSourceFile(mockSourceFile);
    expect(result.preKey).toBe(preKeyUsages);
    expect(result.key[0]?.preKey).toBe("home");
    expect(result.replacement[0]?.preKey).toBe("home");
    expect(result.rich[0]?.preKey).toBe("home");
    expect(result.trans).toEqual([]);
  });

  it("does not attach preKey when no matching entry exists", () => {
    const bindingMap = new Map([["t", {}]]);
    const keyUsages = [usage("t")];
    (collectTranslatorBindings as any).mockReturnValue(bindingMap);
    (collectKeyUsages as any).mockReturnValue(keyUsages);
    (collectReplacementUsages as any).mockReturnValue([]);
    (collectRichUsages as any).mockReturnValue([]);
    (collectPreKeys as any).mockReturnValue({
      preKeyMap: new Map(),
      usages: [],
    });
    (collectTransUsages as any).mockReturnValue([]);
    const result = extractUsagesFromSourceFile(mockSourceFile);
    expect(result.key[0]?.preKey).toBeUndefined();
    expect(result.preKey).toEqual([]);
    expect(result.trans).toEqual([]);
  });
});
