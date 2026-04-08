import { Project, SyntaxKind } from "ts-morph";
import { describe, it, expect } from "vitest";
import { getGenericConfigKey } from "../../../../../../src/core/extract-usages/collectors/utils/get-generic-config-key";

function getCallExpression(code: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("test.ts", code);

  return sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
}

describe("getGenericConfigKey", () => {
  it("gets a config key from the first literal type argument", () => {
    const call = getCallExpression(`
      useTranslator<"common">();
    `);
    expect(getGenericConfigKey(call)).toBe("common");
  });

  it("gets a config key from a single-quoted literal type argument", () => {
    const call = getCallExpression(`
      useTranslator<'common'>();
    `);
    expect(getGenericConfigKey(call)).toBe("common");
  });

  it("gets a config key from a template literal type argument", () => {
    const call = getCallExpression(`
      useTranslator<\`common\`>();
    `);
    expect(getGenericConfigKey(call)).toBe("common");
  });

  it("returns undefined when no type arguments exist", () => {
    const call = getCallExpression(`
      useTranslator();
    `);
    expect(getGenericConfigKey(call)).toBeUndefined();
  });

  it("returns undefined when the first type argument is not a literal type", () => {
    const call = getCallExpression(`
      useTranslator<ConfigKey>();
    `);
    expect(getGenericConfigKey(call)).toBeUndefined();
  });

  it("returns undefined when the first literal type is not a string", () => {
    const call = getCallExpression(`
      useTranslator<123>();
    `);
    expect(getGenericConfigKey(call)).toBeUndefined();
  });

  it("ignores later type arguments", () => {
    const call = getCallExpression(`
      useTranslator<"common", "other">();
    `);
    expect(getGenericConfigKey(call)).toBe("common");
  });
});
