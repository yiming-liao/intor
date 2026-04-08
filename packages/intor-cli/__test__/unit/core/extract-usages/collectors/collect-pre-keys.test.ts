import type { TranslatorBindingMap } from "../../../../../src/core/extract-usages/types";
import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectPreKeys } from "../../../../../src/core/extract-usages/collectors";

const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: { target: 99 },
});
let fileId = 0;

function getSourceFile(code: string) {
  return project.createSourceFile(`test-${fileId++}.ts`, `export {};\n${code}`);
}

describe("collectPreKeys", () => {
  it("collects preKey from first positional string argument", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator("common");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.get("t")).toBe("common");
    expect(usages).toHaveLength(1);
    expect(usages[0]).toMatchObject({
      factory: "useTranslator",
      localName: "t",
      preKey: "common",
    });
  });

  it("collects preKey from a template-literal positional argument", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator(\`common\`);
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.get("t")).toBe("common");
    expect(usages[0]?.preKey).toBe("common");
  });

  it("collects preKey from options object", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator({ preKey: "shared" });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.get("t")).toBe("shared");
    expect(usages[0]?.preKey).toBe("shared");
  });

  it("ignores non-static preKey values", () => {
    const sourceFile = getSourceFile(`
      const key = "dynamic";
      const { t } = useTranslator({ preKey: key });
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.size).toBe(0);
    expect(usages).toHaveLength(0);
  });

  it("ignores calls without a static positional preKey or options object", () => {
    const sourceFile = getSourceFile(`
      const key = "dynamic";
      const { t } = useTranslator(key);
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.size).toBe(0);
    expect(usages).toHaveLength(0);
  });

  it("includes configKey from the translator binding", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator("common");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t", configKey: "shared" }],
    ]);
    const { usages } = collectPreKeys(sourceFile, translatorBindingMap);
    expect(usages[0]).toMatchObject({
      preKey: "common",
      configKey: "shared",
    });
  });

  it("collects preKey for multiple bindings (t / tRich)", () => {
    const sourceFile = getSourceFile(`
      const { t, tRich } = useTranslator("common");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map([
      ["t", { factory: "useTranslator", method: "t" }],
      ["tRich", { factory: "useTranslator", method: "tRich" }],
    ]);
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.get("t")).toBe("common");
    expect(preKeyMap.get("tRich")).toBe("common");
    expect(usages).toHaveLength(2);
  });

  it("does nothing when no matching translator bindings exist", () => {
    const sourceFile = getSourceFile(`
      const { t } = useTranslator("common");
    `);
    const translatorBindingMap: TranslatorBindingMap = new Map();
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );
    expect(preKeyMap.size).toBe(0);
    expect(usages).toHaveLength(0);
  });

  it("ignores options object without preKey", () => {
    const sourceFile = getSourceFile(`
    const { t } = useTranslator({ foo: "bar" });
  `);
    const map = new Map([
      ["t", { factory: "useTranslator", method: "t" } as const],
    ]);
    const { preKeyMap, usages } = collectPreKeys(sourceFile, map);
    expect(preKeyMap.size).toBe(0);
    expect(usages.length).toBe(0);
  });
});
