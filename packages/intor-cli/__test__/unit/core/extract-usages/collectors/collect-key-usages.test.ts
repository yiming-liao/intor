import type { TranslatorBindingMap } from "../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectKeyUsages } from "../../../../../src/core/extract-usages/collectors";

function createSourceFile(code: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  return project.createSourceFile("test.ts", code);
}

describe("collectKeyUsages", () => {
  it("collects a single static key usage", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator("home");
      t("title");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    const usage = result[0];
    expect(usage?.key).toBe("title");
    expect(usage?.localName).toBe("t");
    expect(usage?.factory).toBe("useTranslator");
    expect(usage?.method).toBe("t");
    expect(usage?.file).toContain("test.ts");
    expect(typeof usage?.line).toBe("number");
    expect(typeof usage?.column).toBe("number");
  });

  it("collects multiple key usages from the same binding", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      t("a");
      t("b");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result.map((u) => u.key)).toEqual(["a", "b"]);
  });

  it("ignores non-string-literal keys", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      const key = "title";
      t(key);
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores calls to unregistered translator bindings", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      t("ok");
      x("nope");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]?.key).toBe("ok");
  });

  it("returns an empty array when no usages are found", () => {
    const sourceFile = createSourceFile(`
      const x = () => {};
      x("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map();
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result).toEqual([]);
  });
});
