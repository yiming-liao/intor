import type { SchemaEntry } from "../../../../../src/core/artifacts/types";
import { describe, it, expect } from "vitest";
import { buildSchema } from "../../../../../src/core/artifacts/schema/build-schema";

describe("buildSchema", () => {
  it("emits deterministic key order for schema output", () => {
    const entries: SchemaEntry[] = [
      {
        id: "app",
        locales: ["zh", "en"],
        shapes: {
          messages: {
            kind: "object",
            properties: {
              z: { kind: "primitive", type: "string" },
              a: { kind: "primitive", type: "string" },
            },
          },
          replacements: { kind: "none" },
          rich: { kind: "none" },
        },
      },
    ];

    const output = buildSchema(entries, "0.0.21");

    expect(output).toContain('"entries"');
    expect(output.indexOf('"entries"')).toBeLessThan(
      output.indexOf('"version"'),
    );
    expect(output.indexOf('"a"')).toBeLessThan(output.indexOf('"z"'));
  });
});
