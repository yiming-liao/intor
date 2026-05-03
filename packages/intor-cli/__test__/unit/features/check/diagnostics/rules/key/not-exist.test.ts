import type { KeyUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import type { KeyUsageLike } from "../../../../../../../src/features/check/diagnostics/rules/key/types";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { keyNotExist } from "../../../../../../../src/features/check/diagnostics/rules/key";

function createUsage(partial: Partial<KeyUsage>): KeyUsageLike {
  return {
    method: "t",
    localName: "t",
    key: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("keyNotExist", () => {
  it("reports warn when message key does not exist in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = keyNotExist(createUsage({ key: "missing" }), schema);
    expect(diagnostics).toEqual([
      {
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
    const diagnostics = keyNotExist(createUsage({}), {} as InferNode);
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
    const diagnostics = keyNotExist(
      createUsage({ key: "title", preKey: "home" }),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("accepts exact dotted keys in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        "dashboard.hello": { kind: "primitive", type: "string" },
      },
    };

    const diagnostics = keyNotExist(
      createUsage({ key: "dashboard.hello" }),
      schema,
    );

    expect(diagnostics).toEqual([]);
  });

  it("accepts hybrid dotted keys across levels in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        "dashboard.hello": {
          kind: "object",
          properties: {
            title: { kind: "primitive", type: "string" },
          },
        },
      },
    };

    const diagnostics = keyNotExist(
      createUsage({ key: "dashboard.hello.title" }),
      schema,
    );

    expect(diagnostics).toEqual([]);
  });
});
