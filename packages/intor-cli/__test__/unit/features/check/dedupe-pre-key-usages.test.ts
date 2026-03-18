import type { PreKeyUsage } from "../../../../src/core";
import { describe, it, expect } from "vitest";
import { dedupePreKeyUsages } from "../../../../src/features/check/dedupe-pre-key-usages";

describe("dedupePreKeyUsages", () => {
  it("deduplicates preKey usages from the same translator factory call", () => {
    const usages: PreKeyUsage[] = [
      {
        factory: "useTranslator",
        localName: "t",
        preKey: "home",
        file: "/a.ts",
        line: 10,
        column: 1,
      },
      {
        factory: "useTranslator",
        localName: "tRich",
        preKey: "home",
        file: "/a.ts",
        line: 10,
        column: 20,
      },
    ];
    const result = dedupePreKeyUsages(usages);
    expect(result).toHaveLength(1);
    expect(result[0]?.preKey).toBe("home");
  });

  it("does not deduplicate usages from different factory calls (different line)", () => {
    const usages: PreKeyUsage[] = [
      {
        factory: "useTranslator",
        localName: "t",
        preKey: "home",
        file: "/a.ts",
        line: 10,
        column: 1,
      },
      {
        factory: "useTranslator",
        localName: "tRich",
        preKey: "home",
        file: "/a.ts",
        line: 20,
        column: 1,
      },
    ];
    const result = dedupePreKeyUsages(usages);
    expect(result).toHaveLength(2);
  });

  it("does not deduplicate different preKeys from the same factory call", () => {
    const usages: PreKeyUsage[] = [
      {
        factory: "useTranslator",
        localName: "t",
        preKey: "home",
        file: "/a.ts",
        line: 10,
        column: 1,
      },
      {
        factory: "useTranslator",
        localName: "tRich",
        preKey: "nav",
        file: "/a.ts",
        line: 10,
        column: 20,
      },
    ];
    const result = dedupePreKeyUsages(usages);
    expect(result).toHaveLength(2);
  });

  it("does not deduplicate when preKey is undefined", () => {
    const usages: PreKeyUsage[] = [
      {
        factory: "useTranslator",
        localName: "t",
        file: "/a.ts",
        line: 10,
        column: 1,
      },
      {
        factory: "useTranslator",
        localName: "tRich",
        file: "/a.ts",
        line: 10,
        column: 20,
      },
    ];
    const result = dedupePreKeyUsages(usages);
    expect(result).toHaveLength(1);
  });

  it("does not deduplicate identical preKeys from different files", () => {
    const usages: PreKeyUsage[] = [
      {
        factory: "useTranslator",
        localName: "t",
        preKey: "home",
        file: "/a.ts",
        line: 10,
        column: 1,
      },
      {
        factory: "useTranslator",
        localName: "t",
        preKey: "home",
        file: "/b.ts",
        line: 10,
        column: 1,
      },
    ];
    const result = dedupePreKeyUsages(usages);
    expect(result).toHaveLength(2);
  });
});
