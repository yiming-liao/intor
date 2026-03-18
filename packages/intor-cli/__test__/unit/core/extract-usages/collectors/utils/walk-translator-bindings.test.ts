import { Project } from "ts-morph";
import { describe, it, expect, vi } from "vitest";
import { walkTranslatorBindings } from "../../../../../../src/core/extract-usages/collectors/utils/walk-translator-bindings";

function createSourceFile(code: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { target: 99 },
  });

  return project.createSourceFile("test.ts", code);
}

describe("walkTranslatorBindings", () => {
  it("visits destructured variable declarations initialized by a call", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).toHaveBeenCalledTimes(1);
    const ctx = visitor.mock.calls[0]?.[0];
    expect(ctx.call.getText()).toBe("useTranslator()");
    expect(ctx.binding.getText()).toBe("{ t }");
  });

  it("supports awaited call initializers", () => {
    const sourceFile = createSourceFile(`
      const { t } = await useTranslator();
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).toHaveBeenCalledTimes(1);
    expect(visitor.mock.calls[0]?.[0].call.getText()).toBe("useTranslator()");
  });

  it("ignores non-destructured bindings", () => {
    const sourceFile = createSourceFile(`
      const translator = useTranslator();
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("ignores variable declarations without initializers", () => {
    const sourceFile = createSourceFile(`
      let t;
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("ignores initializers that are not call expressions", () => {
    const sourceFile = createSourceFile(`
      const { t } = translator;
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).not.toHaveBeenCalled();
  });

  it("visits multiple destructured bindings in a single file", () => {
    const sourceFile = createSourceFile(`
      const { t } = useTranslator();
      const { hasKey } = getTranslator();
    `);
    const visitor = vi.fn();
    walkTranslatorBindings(sourceFile, visitor);
    expect(visitor).toHaveBeenCalledTimes(2);
    expect(visitor.mock.calls[0]?.[0].binding.getText()).toBe("{ t }");
    expect(visitor.mock.calls[1]?.[0].binding.getText()).toBe("{ hasKey }");
  });
});
