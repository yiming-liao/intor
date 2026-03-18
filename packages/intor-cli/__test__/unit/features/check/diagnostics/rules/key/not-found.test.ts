import type { KeyUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import type { KeyUsageLike } from "../../../../../../../src/features/check/diagnostics/rules/key/types";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { keyNotFound } from "../../../../../../../src/features/check/diagnostics/rules/key";

function createUsage(partial: Partial<KeyUsage>): KeyUsageLike {
  return {
    origin: "t",
    localName: "t",
    key: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("keyNotFound", () => {
  it("reports warn when message key does not exist in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = keyNotFound(createUsage({ key: "missing" }), schema);
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "missing",
        code: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.message(),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("returns no diagnostics when no message key", () => {
    const diagnostics = keyNotFound(createUsage({}), {} as InferNode);
    expect(diagnostics).toEqual([]);
  });

  it("resolves key with preKey correctly", () => {
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
    const diagnostics = keyNotFound(
      createUsage({ key: "title", preKey: "home" }),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });
});
