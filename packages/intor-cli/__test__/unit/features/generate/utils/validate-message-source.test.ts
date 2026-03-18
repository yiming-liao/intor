/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ConfigEntry } from "../../../../../src/core";
import type { MessageSource } from "../../../../../src/features";
import { describe, it, expect } from "vitest";
import { validateMessageSource } from "../../../../../src/features/generate/utils/validate-message-source";

function mockConfigEntries(ids: string[]): ConfigEntry[] {
  return ids.map((id) => ({ config: { id } as any, filePath: "" }));
}

describe("validateMessageSource", () => {
  // ----------------------------------------------------------
  // mode: none
  // ----------------------------------------------------------
  it("allows mode=none for any number of configs", () => {
    const source: MessageSource = { mode: "none" };
    expect(() =>
      validateMessageSource(source, mockConfigEntries([])),
    ).not.toThrow();
    expect(() =>
      validateMessageSource(source, mockConfigEntries(["a", "b"])),
    ).not.toThrow();
  });

  // ----------------------------------------------------------
  // mode: single
  // ----------------------------------------------------------
  it("allows single mode when exactly one config exists", () => {
    const source: MessageSource = {
      mode: "single",
      file: "messages.json",
    };
    expect(() =>
      validateMessageSource(source, mockConfigEntries(["app"])),
    ).not.toThrow();
  });

  it("throws when single mode is used with multiple configs", () => {
    const source: MessageSource = {
      mode: "single",
      file: "messages.json",
    };
    expect(() =>
      validateMessageSource(source, mockConfigEntries(["a", "b"])),
    ).toThrow(
      /--message-file can only be used when exactly one Intor config is found./,
    );
  });

  // ----------------------------------------------------------
  // mode: mapping
  // ----------------------------------------------------------
  it("allows mapping mode when all ids exist", () => {
    const source: MessageSource = {
      mode: "mapping",
      files: {
        app: "app.json",
        admin: "admin.json",
      },
    };
    expect(() =>
      validateMessageSource(source, mockConfigEntries(["app", "admin"])),
    ).not.toThrow();
  });

  it("throws when mapping contains unknown config id", () => {
    const source: MessageSource = {
      mode: "mapping",
      files: {
        app: "app.json",
        unknown: "x.json",
      },
    };
    expect(() =>
      validateMessageSource(source, mockConfigEntries(["app"])),
    ).toThrow(/Unknown config id/);
  });
});
