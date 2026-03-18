import type {
  KeyUsage,
  ReplacementUsage,
} from "../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../src/features/check/diagnostics/messages";
import { enforceMissingReplacements } from "../../../../../../src/features/check/diagnostics/rules/enforce-missing-replacements";

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

function createReplacementUsage(
  partial: Partial<ReplacementUsage>,
): ReplacementUsage {
  return {
    factory: "useTranslator",
    method: "t",
    localName: "t",
    key: "",
    replacements: [],
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("validateMissingReplacements", () => {
  it("does nothing when replacements are provided somewhere else", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const replacementIndex = new Map<string, ReplacementUsage[]>([
      [
        "t::greeting",
        [
          createReplacementUsage({
            key: "greeting",
            replacements: ["name"],
          }),
        ],
      ],
    ]);
    const diagnostics = enforceMissingReplacements(
      createKeyUsage({ key: "greeting" }),
      replacementIndex,
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema does not define replacements", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = enforceMissingReplacements(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema defines no required replacements", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {},
        },
      },
    };
    const diagnostics = enforceMissingReplacements(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("reports error when required replacements are never provided", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const diagnostics = enforceMissingReplacements(
      createKeyUsage({ key: "greeting" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "greeting",
        code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.message(["name"]),
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
                name: { kind: "primitive", type: "string" },
              },
            },
          },
        },
      },
    };
    const diagnostics = enforceMissingReplacements(
      createKeyUsage({ key: "greeting", preKey: "home" }),
      new Map(),
      schema,
    );
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "home.greeting",
        code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.message(["name"]),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });
});
