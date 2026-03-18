import { Project, SyntaxKind, type CallExpression } from "ts-morph";
import { describe, it, expect } from "vitest";
import { getObjectArg } from "../../../../../../src/core/extract-usages/collectors/utils/get-object-arg";

function getCall(code: string): CallExpression {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });
  const sourceFile = project.createSourceFile("test.ts", code);
  return sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
}

describe("getObjectArg", () => {
  it('returns the first argument when position is "first"', () => {
    const call = getCall(`
      fn({ a: 1 }, { b: 2 });
    `);
    const obj = getObjectArg(call, "first");
    expect(obj?.getText()).toBe("{ a: 1 }");
  });

  it('returns the last argument when position is "last"', () => {
    const call = getCall(`
      fn(1, { a: 1 }, { b: 2 });
    `);
    const obj = getObjectArg(call, "last");
    expect(obj?.getText()).toBe("{ b: 2 }");
  });

  it("uses human 1-based index for numeric positions", () => {
    const call = getCall(`
      fn("key", { a: 1 }, { b: 2 });
    `); // position = 2 → second argument
    const second = getObjectArg(call, 2);
    expect(second?.getText()).toBe("{ a: 1 }"); // position = 3 → third argument
    const third = getObjectArg(call, 3);
    expect(third?.getText()).toBe("{ b: 2 }");
  });

  it("returns null if the numeric position does not exist", () => {
    const call = getCall(`
      fn("key");
    `);
    const obj = getObjectArg(call, 2);
    expect(obj).toBeNull();
  });

  it("returns null if the target argument is not an object literal", () => {
    const call = getCall(`
      fn("key", 123);
    `);
    const obj = getObjectArg(call, 2);
    expect(obj).toBeNull();
  });

  it("does not scan other arguments for object literals", () => {
    const call = getCall(`
      fn({ a: 1 }, "skip", { b: 2 });
    `); // second argument is not an object → should NOT fall back
    const second = getObjectArg(call, 2);
    expect(second).toBeNull();
  });

  it("returns null when the call has no arguments", () => {
    const call = getCall(`
      fn();
    `);
    expect(getObjectArg(call, "first")).toBeNull();
    expect(getObjectArg(call, "last")).toBeNull();
    expect(getObjectArg(call, 1)).toBeNull();
  });
});
