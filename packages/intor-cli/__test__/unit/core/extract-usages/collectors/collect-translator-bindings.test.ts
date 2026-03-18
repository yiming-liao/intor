import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectTranslatorBindings } from "../../../../../src/core/extract-usages/collectors";

function collectFromCode(code: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("test.ts", code);
  return collectTranslatorBindings(sourceFile);
}

describe("collectTranslatorUsage", () => {
  it("collects destructured translator method usage", () => {
    const usage = collectFromCode(`
      const { t, tRich } = useTranslator();
      t("home.title");
      tRich("home.title");
    `);
    expect(usage.size).toBe(2);
    expect(usage.get("t")).toEqual({
      factory: "useTranslator",
      method: "t",
    });
    expect(usage.get("tRich")).toEqual({
      factory: "useTranslator",
      method: "tRich",
    });
  });

  it("supports awaited translator factory calls", () => {
    const usage = collectFromCode(`
      const { t } = await getTranslator();
      t("key");
    `);
    expect(usage.size).toBe(1);
    expect(usage.get("t")).toEqual({
      factory: "getTranslator",
      method: "t",
    });
  });

  it("ignores non-translator factory calls", () => {
    const usage = collectFromCode(`
      const { t } = createSomethingElse();
      t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores non-destructured bindings", () => {
    const usage = collectFromCode(`
      const translator = useTranslator();
      translator.t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores destructured properties that are not translator methods", () => {
    const usage = collectFromCode(`
      const { foo, bar } = useTranslator();
      foo("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("supports aliased destructured bindings", () => {
    const usage = collectFromCode(`
      const { t: translate } = useTranslator();
      translate("key");
    `);
    expect(usage.size).toBe(1);
    expect(usage.get("translate")).toEqual({
      factory: "useTranslator",
      method: "t",
    });
  });

  it("ignores calls whose callee is not an identifier", () => {
    const result = collectFromCode(`
    const { t } = i18n.useTranslator();
  `);
    expect(result.size).toBe(0);
  });
});
