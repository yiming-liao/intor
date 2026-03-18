import { Project, SyntaxKind } from "ts-morph";
import { describe, it, expect } from "vitest";
import { isStaticStringLiteral } from "../../../../../../src/core/extract-usages/collectors/utils/is-static-string-literal";

function getFirstNodeOfKind(code: string, kind: SyntaxKind) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });
  const sourceFile = project.createSourceFile("test.ts", code);
  return sourceFile.getFirstDescendantByKindOrThrow(kind);
}

describe("isStaticStringLiteral", () => {
  it("returns true for double-quoted string literals", () => {
    const node = getFirstNodeOfKind(
      `const a = "hello";`,
      SyntaxKind.StringLiteral,
    );
    expect(isStaticStringLiteral(node)).toBe(true);
  });

  it("returns true for single-quoted string literals", () => {
    const node = getFirstNodeOfKind(
      `const a = 'hello';`,
      SyntaxKind.StringLiteral,
    );
    expect(isStaticStringLiteral(node)).toBe(true);
  });

  it("returns true for no-substitution template literals", () => {
    const node = getFirstNodeOfKind(
      "const a = `hello`;",
      SyntaxKind.NoSubstitutionTemplateLiteral,
    );
    expect(isStaticStringLiteral(node)).toBe(true);
  });

  it("returns false for template literals with substitutions", () => {
    const node = getFirstNodeOfKind(
      "const a = `hello ${name}`;",
      SyntaxKind.TemplateExpression,
    );
    expect(isStaticStringLiteral(node)).toBe(false);
  });

  it("returns false for non-string literal nodes", () => {
    const numberNode = getFirstNodeOfKind(
      "const a = 123;",
      SyntaxKind.NumericLiteral,
    );
    expect(isStaticStringLiteral(numberNode)).toBe(false);
  });

  it("returns false when node is undefined", () => {
    expect(isStaticStringLiteral(undefined)).toBe(false);
  });

  it("acts as a proper type guard", () => {
    const node = getFirstNodeOfKind(
      `const a = "typed";`,
      SyntaxKind.StringLiteral,
    );
    if (isStaticStringLiteral(node)) {
      // This should be type-safe if the guard works correctly
      expect(node.getLiteralText()).toBe("typed");
    } else {
      throw new Error("Expected node to be a static string literal");
    }
  });
});
