import type { SchemaEntry } from "../../../../../src/core/artifacts/types";
import { describe, it, expect } from "vitest";
import { buildTypes } from "../../../../../src/core/artifacts/types/build-types";
import {
  DEFAULT_CONFIG_KEY,
  GENERATED_FIELD,
  GENERATED_INTERFACE_NAME,
  INTOR_GENERATED_KEY,
} from "../../../../../src/core/artifacts/types/contract";

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

    expect(output).toContain(`${GENERATED_FIELD.locales}: "zh" | "en";`);
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

  it("emits the default config key once and keeps additional config entries", () => {
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

    expect(output.match(new RegExp(DEFAULT_CONFIG_KEY, "g"))).toHaveLength(1);
    expect(output).toContain('"first": {');
    expect(output).toContain('"second": {');
  });

  it("emits the shared generated sentinel key in the global interface", () => {
    const schemaEntries: SchemaEntry[] = [
      {
        id: "app",
        locales: ["en"],
        shapes: {
          messages: { kind: "none" },
          replacements: { kind: "none" },
          rich: { kind: "none" },
        },
      },
    ];

    const output = buildTypes(schemaEntries);

    expect(output).toContain(`interface ${GENERATED_INTERFACE_NAME} {`);
    expect(output).toContain(`${INTOR_GENERATED_KEY}: true;`);
  });
});
