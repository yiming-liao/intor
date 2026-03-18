import type { TranslatorBindingMap } from "../../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect, vi } from "vitest";
import { walkTranslatorMethodCalls } from "../../../../../../src/core/extract-usages/collectors/utils/walk-translator-method-calls";

function createSourceFile(code: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });

  return project.createSourceFile("test.ts", code);
}

describe("walkTranslatorMethodCalls", () => {
  it("visits direct identifier translator calls", () => {
    const sourceFile = createSourceFile(`
      const t = () => {};
      t("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      [
        "t",
        {
          factory: "useTranslator",
          method: "t",
        },
      ],
    ]);
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).toHaveBeenCalledTimes(1);
    const ctx = visitor.mock.calls[0]?.[0];
    expect(ctx.localName).toBe("t");
    expect(ctx.translatorUsage.method).toBe("t");
    expect(ctx.call.getText()).toBe(`t("hello")`);
  });

  it("ignores calls that are not in translatorBindingMap", () => {
    const sourceFile = createSourceFile(`
      foo("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map();
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("ignores property access calls (e.g. translator.t())", () => {
    const sourceFile = createSourceFile(`
      translator.t("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      [
        "t",
        {
          factory: "useTranslator",
          method: "t",
        },
      ],
    ]);
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("ignores chained calls (e.g. getTranslator().t())", () => {
    const sourceFile = createSourceFile(`
      getTranslator().t("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      [
        "t",
        {
          factory: "getTranslator",
          method: "t",
        },
      ],
    ]);
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("visits multiple translator calls in a single file", () => {
    const sourceFile = createSourceFile(`
      t("a");
      t("b");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      [
        "t",
        {
          factory: "useTranslator",
          method: "t",
        },
      ],
    ]);
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).toHaveBeenCalledTimes(2);
    expect(visitor.mock.calls[0]?.[0].call.getText()).toBe(`t("a")`);
    expect(visitor.mock.calls[1]?.[0].call.getText()).toBe(`t("b")`);
  });
});
