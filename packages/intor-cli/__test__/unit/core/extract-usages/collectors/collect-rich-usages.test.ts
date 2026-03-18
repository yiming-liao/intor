import type { TranslatorBindingMap } from "../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectRichUsages } from "../../../../../src/core/extract-usages/collectors";

function getSourceFile(code: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });
  return project.createSourceFile("test.ts", code);
}

describe("collectRichUsages", () => {
  it("collects rich tag keys from tRich() calls", () => {
    const sourceFile = getSourceFile(`
      const { tRich } = useTranslator();
      tRich("hello", { bold: "<b />", italic: "<i />" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      localName: "tRich",
      key: "hello",
      rich: ["bold", "italic"],
    });
  });

  it("ignores calls with non-static translation keys", () => {
    const sourceFile = getSourceFile(`
      const { tRich } = useTranslator();
      const key = "dynamic";
      tRich(key, { bold: "<b />" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores calls without a rich object argument", () => {
    const sourceFile = getSourceFile(`
      const { tRich } = useTranslator();
      tRich("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores rich objects when extractStaticObjectKeys returns empty", () => {
    const sourceFile = getSourceFile(`
    const { tRich } = useTranslator();
    const tag = "<b />";
    tRich("hello", { [tag]: "<x />" });
  `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("supports multiple rich usages in a single file", () => {
    const sourceFile = getSourceFile(`
      const { tRich } = useTranslator();
      tRich("a", { x: "<x />" });
      tRich("b", { y: "<y />", z: "<z />" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(2);
    expect(result[0]?.rich).toEqual(["x"]);
    expect(result[1]?.rich).toEqual(["y", "z"]);
  });

  it("ignores translator methods that are not tRich", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator();
      t("hello", { bold: "<b />" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });

  it("ignores non-translator method calls", () => {
    const sourceFile = getSourceFile(`
      function tRich(key, obj) {}
      tRich("hello", { bold: "<b />" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map();
    const result = collectRichUsages(sourceFile, translatorBindingMap);
    expect(result).toHaveLength(0);
  });
});
