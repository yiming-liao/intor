import { Project, SyntaxKind } from "ts-morph";
import { describe, it, expect } from "vitest";
import { extractStaticObjectKeys } from "../../../../../../src/core/extract-usages/collectors/utils/extract-static-object-keys";

function getObjectLiteral(code: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("test.ts", code);
  return sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)[0];
}

describe("extractStaticObjectKeys", () => {
  it("extracts identifier keys", () => {
    const obj = getObjectLiteral(`
      const x = { name: "John", count: 3 };
    `);
    const keys = extractStaticObjectKeys(obj!);
    expect(keys).toEqual(["name", "count"]);
  });

  it("extracts string literal keys", () => {
    const obj = getObjectLiteral(`
      const x = { "first-name": "John", "age": 20 };
    `);
    const keys = extractStaticObjectKeys(obj!);
    expect(keys).toEqual(["first-name", "age"]);
  });

  it("ignores non-property assignments", () => {
    const obj = getObjectLiteral(`
      const x = {
        name: "John",
        ...other,
        get value() { return 1; }
      };
    `);
    const keys = extractStaticObjectKeys(obj!);
    expect(keys).toEqual(["name"]);
  });

  it("returns empty array for empty object", () => {
    const obj = getObjectLiteral(`
      const x = {};
    `);
    const keys = extractStaticObjectKeys(obj!);
    expect(keys).toEqual([]);
  });

  it("extracts string literal keys that are not valid identifiers", () => {
    const obj = getObjectLiteral(`
    const x = {
      "first-name": "John",
      "foo bar": 1
    };
  `);
    const keys = extractStaticObjectKeys(obj!);
    expect(keys).toEqual(["first-name", "foo bar"]);
  });
});
