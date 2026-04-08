import type { TranslatorBindingMap } from "../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectKeyUsages } from "../../../../../src/core/extract-usages/collectors";

const project = new Project({ useInMemoryFileSystem: true });
let fileId = 0;

function createSourceFile(code: string) {
  return project.createSourceFile(`test-${fileId++}.ts`, `export {};\n${code}`);
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
    expect(usage?.file).toContain("test-");
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

  it("collects template-literal keys without substitutions", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      t(\`title\`);
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]?.key).toBe("title");
  });

  it("includes configKey from the translator binding", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      t("title");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t", configKey: "common" }],
    ]);
    const result = collectKeyUsages(sourceFile, translatorBindingMap);
    expect(result[0]).toMatchObject({
      key: "title",
      configKey: "common",
    });
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
