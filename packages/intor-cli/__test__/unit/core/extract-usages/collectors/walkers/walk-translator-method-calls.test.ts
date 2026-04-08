import type { TranslatorBindingMap } from "../../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect, vi } from "vitest";
import { walkTranslatorMethodCalls } from "../../../../../../src/core/extract-usages/collectors/walkers/walk-translator-method-calls";

const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: { target: 99 },
});
let fileId = 0;

function createSourceFile(code: string) {
  return project.createSourceFile(`test-${fileId++}.ts`, `export {};\n${code}`);
}

describe("walkTranslatorMethodCalls", () => {
  it("visits direct identifier translator calls", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
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

  it("ignores unresolved identifiers even when the local name is registered", () => {
    const sourceFile = createSourceFile(`
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

  it("ignores array destructured bindings with the same local name", () => {
    const sourceFile = createSourceFile(`
      const [t] = useTranslator();
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
    expect(visitor).not.toHaveBeenCalled();
  });

  it("visits multiple translator calls in a single file", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
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

  it("supports aliased destructured bindings", () => {
    const sourceFile = createSourceFile(`
      const { t: translate } = useTranslator();
      translate("hello");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      [
        "translate",
        {
          factory: "useTranslator",
          method: "t",
        },
      ],
    ]);
    const visitor = vi.fn();
    walkTranslatorMethodCalls(sourceFile, translatorBindingMap, visitor);
    expect(visitor).toHaveBeenCalledTimes(1);
    expect(visitor.mock.calls[0]?.[0].localName).toBe("translate");
  });

  it("ignores shadowed parameters with the same local name", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      function demo(t) {
        t("hello");
      }
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

  it("ignores shadowed local variables with the same local name", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      {
        const t = createLogger();
        t("hello");
      }
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
});
