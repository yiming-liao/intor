import type { MessageSource } from "../../../../../src/features";
import { describe, it, expect } from "vitest";
import { resolveMessageSource } from "../../../../../src/features/generate/utils/resolve-message-source";

describe("resolveMessageSource", () => {
  it("returns undefined in none mode", () => {
    const source: MessageSource = { mode: "none" };
    const result = resolveMessageSource(source, "any-config");
    expect(result).toBeUndefined();
  });

  it("returns the same file for any config in single mode", () => {
    const source: MessageSource = {
      mode: "single",
      file: "/path/to/messages.json",
    };
    expect(resolveMessageSource(source, "config-a")).toBe(
      "/path/to/messages.json",
    );
    expect(resolveMessageSource(source, "config-b")).toBe(
      "/path/to/messages.json",
    );
  });

  it("returns mapped file for matching config id in mapping mode", () => {
    const source: MessageSource = {
      mode: "mapping",
      files: {
        app: "/path/to/app.json",
        admin: "/path/to/admin.json",
      },
    };
    const result = resolveMessageSource(source, "admin");
    expect(result).toBe("/path/to/admin.json");
  });

  it("returns undefined for unknown config id in mapping mode", () => {
    const source: MessageSource = {
      mode: "mapping",
      files: {
        app: "/path/to/app.json",
      },
    };
    const result = resolveMessageSource(source, "unknown");
    expect(result).toBeUndefined();
  });
});
