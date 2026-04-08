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
      import { useTranslator } from "intor/react";
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
      import { getTranslator } from "intor/server";
      const { t } = await getTranslator();
      t("key");
    `);
    expect(usage.size).toBe(1);
    expect(usage.get("t")).toEqual({
      factory: "getTranslator",
      method: "t",
    });
  });

  it("supports configKey from a literal type argument", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "intor/react";
      const { t } = useTranslator<"common">();
      t("key");
    `);
    expect(usage.get("t")).toEqual({
      factory: "useTranslator",
      method: "t",
      configKey: "common",
    });
  });

  it("ignores non-translator factory calls", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "intor/react";
      const { t } = createSomethingElse();
      t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores non-destructured bindings", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "intor/react";
      const translator = useTranslator();
      translator.t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores destructured properties that are not translator methods", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "intor/react";
      const { foo, bar } = useTranslator();
      foo("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("supports aliased destructured bindings", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "intor/react";
      const { t: translate } = useTranslator();
      translate("key");
    `);
    expect(usage.size).toBe(1);
    expect(usage.get("translate")).toEqual({
      factory: "useTranslator",
      method: "t",
    });
  });

  it("supports aliased translator factory imports", () => {
    const usage = collectFromCode(`
      import { useTranslator as useT } from "intor/react";
      const { t } = useT();
      t("key");
    `);
    expect(usage.size).toBe(1);
    expect(usage.get("t")).toEqual({
      factory: "useTranslator",
      method: "t",
    });
  });

  it("ignores same-name factories imported from non-Intor modules", () => {
    const usage = collectFromCode(`
      import { useTranslator } from "./custom-i18n";
      const { t } = useTranslator();
      t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores same-name local functions that are not imported from Intor", () => {
    const usage = collectFromCode(`
      function useTranslator() {
        return { t() {} };
      }

      const { t } = useTranslator();
      t("key");
    `);
    expect(usage.size).toBe(0);
  });

  it("ignores calls whose callee is not an identifier", () => {
    const result = collectFromCode(`
      import { useTranslator } from "intor/react";
      const { t } = i18n.useTranslator();
      const { hasKey } = getFactory()();
    `);
    expect(result.size).toBe(0);
  });
});
