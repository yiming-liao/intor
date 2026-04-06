import type { SchemaEntry } from "../../../../../src/core/artifacts/types";
import { describe, it, expect } from "vitest";
import { buildTypes } from "../../../../../src/core/artifacts/types/build-types";

describe("buildTypes", () => {
  it("emits deterministic locale and property ordering", () => {
    const schemaEntries: SchemaEntry[] = [
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
          replacements: {
            kind: "object",
            properties: {
              b: { kind: "primitive", type: "string" },
              a: { kind: "primitive", type: "string" },
            },
          },
          rich: {
            kind: "object",
            properties: {
              d: { kind: "none" },
              c: { kind: "none" },
            },
          },
        },
      },
    ];

    const output = buildTypes(schemaEntries);

    expect(output).toContain('Locales: "zh" | "en";');
    expect(output.indexOf('"a": string;')).toBeLessThan(
      output.indexOf('"z": string;'),
    );
    expect(output.indexOf('"a": string;')).toBeLessThan(
      output.indexOf('"b": string;'),
    );
    expect(output.indexOf('"c": Record<string, never>;')).toBeLessThan(
      output.indexOf('"d": Record<string, never>;'),
    );
  });

  it("emits __default__ once and keeps additional config entries", () => {
    const schemaEntries: SchemaEntry[] = [
      {
        id: "first",
        locales: ["en"],
        shapes: {
          messages: { kind: "none" },
          replacements: { kind: "none" },
          rich: { kind: "none" },
        },
      },
      {
        id: "second",
        locales: ["en"],
        shapes: {
          messages: { kind: "none" },
          replacements: { kind: "none" },
          rich: { kind: "none" },
        },
      },
    ];

    const output = buildTypes(schemaEntries);

    expect(output.match(/__default__/g)).toHaveLength(1);
    expect(output).toContain('"first": {');
    expect(output).toContain('"second": {');
  });
});
