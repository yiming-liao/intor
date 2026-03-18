import type { TranslatorBindingMap } from "../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectReplacementUsages } from "../../../../../src/core/extract-usages/collectors";
import { TRANSLATOR_METHOD } from "../../../../../src/core/extract-usages/translator-registry";

function getSourceFile(code: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });
  return project.createSourceFile("test.ts", code);
}

describe("collectReplacementUsages", () => {
  it("collects replacement keys from t() calls", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator();
      t("hello", { name: "world", count: 1 });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      localName: "t",
      key: "hello",
      replacements: ["name", "count"],
    });
  });

  it("collects replacement keys from tRich() calls", () => {
    const sourceFile = getSourceFile(`
      const { tRich } = useTranslator();
      const tags = {};
      tRich("welcome", tags, { user: "A", age: 18 });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: TRANSLATOR_METHOD.tRich }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      localName: "tRich",
      key: "welcome",
      replacements: ["user", "age"],
    });
  });

  it("ignores calls with non-static translation keys", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator();
      const key = "dynamic";
      t(key, { name: "x" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores calls without a replacements object", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator();
      t("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("collects replacement keys even if values are dynamic", () => {
    const sourceFile = getSourceFile(`
    const { t } = useTranslator();
    const value = "x";
    t("hello", { name: value });
  `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]?.replacements).toEqual(["name"]);
  });

  it("supports multiple replacement usages in a single file", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator();
      t("a", { x: 1 });
      t("b", { y: 2, z: 3 });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(2);
    expect(result[0]?.replacements).toEqual(["x"]);
    expect(result[1]?.replacements).toEqual(["y", "z"]);
  });

  it("ignores non-translator method calls", () => {
    const sourceFile = getSourceFile(`
      function t(key: string, obj: any) {}
      t("hello", { a: 1 });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map();
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores translator methods that do not support replacements", () => {
    const sourceFile = getSourceFile(`
    const { hasKey } = useTranslator();
    hasKey("hello", { a: 1 });
  `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["hasKey", { factory: "useTranslator", method: "hasKey" }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores replacement objects when extractStaticObjectKeys returns empty", () => {
    const sourceFile = getSourceFile(`
    const { t } = useTranslator();
    const value = "x";
    t("hello", { name });
  `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: TRANSLATOR_METHOD.t }],
    ]);
    const result = collectReplacementUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });
});
