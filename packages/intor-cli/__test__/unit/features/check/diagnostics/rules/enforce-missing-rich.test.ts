import type {
  KeyUsage,
  RichUsage,
} from "../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../src/features/check/diagnostics/messages";
import { enforceMissingRich } from "../../../../../../src/features/check/diagnostics/rules/enforce-missing-rich";

function createKeyUsage(partial: Partial<KeyUsage>): KeyUsage {
  return {
    factory: "useTranslator",
    method: "t",
    localName: "t",
    key: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

function createRichUsage(partial: Partial<RichUsage>): RichUsage {
  return {
    factory: "useTranslator",
    method: "tRich",
    localName: "tRich",
    key: "",
    rich: [],
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("validateMissingRich", () => {
  it("does nothing when rich tags are provided somewhere else", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    };
    const richIndex = new Map<string, RichUsage[]>([
      ["t::greeting", [createRichUsage({ key: "greeting", rich: ["a"] })]],
    ]);
    const diagnostics = enforceMissingRich(
      createKeyUsage({ key: "greeting" }),
      richIndex,
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema does not define rich tags", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = enforceMissingRich(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema defines no required rich tags", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {},
        },
      },
    };
    const diagnostics = enforceMissingRich(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("warns when required rich tags are never provided", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    };
    const diagnostics = enforceMissingRich(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "greeting",
        code: DIAGNOSTIC_MESSAGES.RICH_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.RICH_MISSING.message(["a"]),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("resolves key path using preKey correctly", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            greeting: {
              kind: "object",
              properties: {
                a: { kind: "none" },
              },
            },
          },
        },
      },
    };
    const diagnostics = enforceMissingRich(
      createKeyUsage({ key: "greeting", preKey: "home" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "home.greeting",
        code: DIAGNOSTIC_MESSAGES.RICH_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.RICH_MISSING.message(["a"]),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });
});
