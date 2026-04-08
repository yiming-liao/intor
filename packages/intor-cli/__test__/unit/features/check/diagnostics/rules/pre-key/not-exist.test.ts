import type {
  KeyUsage,
  PreKeyUsage,
} from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { preKeyNotExist } from "../../../../../../../src/features/check/diagnostics/rules/pre-key";

function createUsage(partial: Partial<KeyUsage>): PreKeyUsage {
  return {
    factory: "useTranslator",
    localName: "t",
    preKey: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("preKeyNotExist", () => {
  it("reports warn when preKey does not exist in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = preKeyNotExist(
      createUsage({ preKey: "missing" }),
      schema,
    );
    expect(diagnostics).toEqual([
      {
        origin: "useTranslator",
        messageKey: "missing",
        code: DIAGNOSTIC_MESSAGES.PRE_KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.PRE_KEY_NOT_FOUND.message(),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("returns no diagnostics when preKey is missing", () => {
    const diagnostics = preKeyNotExist(createUsage({}), {} as InferNode);
    expect(diagnostics).toEqual([]);
  });

  it("returns no diagnostics when preKey exists in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const diagnostics = preKeyNotExist(
      createUsage({ key: "title", preKey: "home" }),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });
});
