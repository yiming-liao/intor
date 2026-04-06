/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as core from "../../../../src/core";
import { prepareSchema } from "../../../../src/features/shared/prepare-schema";

describe("prepareSchema", () => {
  const readSchemaMock = vi.spyOn(core, "readSchema");

  beforeEach(() => {
    readSchemaMock.mockReset();
  });

  it("returns schema entries and default entry when schema is valid", async () => {
    readSchemaMock.mockResolvedValue({
      version: 1,
      entries: [
        { id: "app", locales: ["en"], shapes: {} as any },
        { id: "admin", locales: ["en", "ja"], shapes: {} as any },
      ],
    });
    const result = await prepareSchema();
    expect(result.defaultEntry.id).toBe("app");
    expect(result.schemaEntries.map((entry) => entry.id)).toEqual([
      "app",
      "admin",
    ]);
  });

  it("accepts ids when all requested ids exist in schema", async () => {
    readSchemaMock.mockResolvedValue({
      version: 1,
      entries: [
        { id: "app", locales: ["en"], shapes: {} as any },
        { id: "admin", locales: ["en"], shapes: {} as any },
      ],
    });
    await expect(prepareSchema(["admin", "app"])).resolves.toEqual({
      defaultEntry: { id: "app", locales: ["en"], shapes: {} as any },
      schemaEntries: [
        { id: "app", locales: ["en"], shapes: {} as any },
        { id: "admin", locales: ["en"], shapes: {} as any },
      ],
    });
  });

  it("throws when generated schema has no entries", async () => {
    readSchemaMock.mockResolvedValue({
      version: 1,
      entries: [],
    });
    await expect(prepareSchema()).rejects.toThrow(
      "No generated config schema found. Run `intor generate` first.",
    );
  });

  it("throws with missing config ids when schema is incomplete", async () => {
    readSchemaMock.mockResolvedValue({
      version: 1,
      entries: [{ id: "app", locales: ["en"], shapes: {} as any }],
    });
    await expect(prepareSchema(["app", "admin", "web"])).rejects.toThrow(
      [
        "Generated schema is missing entries for the following config IDs:",
        "  - admin",
        "  - web",
        "",
        "Run `intor generate` first.",
      ].join("\n"),
    );
  });

  it("skips id completeness check when ids is an empty array", async () => {
    readSchemaMock.mockResolvedValue({
      version: 1,
      entries: [{ id: "app", locales: ["en"], shapes: {} as any }],
    });
    const result = await prepareSchema([]);
    expect(result.defaultEntry.id).toBe("app");
    expect(result.schemaEntries).toHaveLength(1);
  });
});
