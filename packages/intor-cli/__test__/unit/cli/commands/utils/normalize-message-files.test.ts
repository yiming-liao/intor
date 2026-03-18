import type { MessageSource } from "../../../../../src/features";
import { describe, it, expect } from "vitest";
import { normalizeMessageFiles } from "../../../../../src/cli/commands/utils/normalize-message-files";

describe("normalizeMessageFiles", () => {
  it("returns none mode when no options are provided", () => {
    const result = normalizeMessageFiles();
    expect(result).toEqual<MessageSource>({
      mode: "none",
    });
  });

  it("returns single mode when --message-file is provided", () => {
    const result = normalizeMessageFiles("messages.json");
    expect(result).toEqual<MessageSource>({
      mode: "single",
      file: "messages.json",
    });
  });

  it("returns mapping mode when --message-files are provided", () => {
    const result = normalizeMessageFiles(undefined, [
      "app=app.json",
      "cms=cms.json",
    ]);
    expect(result).toEqual<MessageSource>({
      mode: "mapping",
      files: {
        app: "app.json",
        cms: "cms.json",
      },
    });
  });

  it("throws when both --message-file and --message-files are provided", () => {
    expect(() =>
      normalizeMessageFiles("messages.json", ["app=app.json"]),
    ).toThrow(
      "Cannot use --message-file and --message-files at the same time.",
    );
  });

  it("throws on invalid --message-files entry (missing '=')", () => {
    expect(() => normalizeMessageFiles(undefined, ["invalid"])).toThrow(
      'Invalid --message-files entry: "invalid". Each entry must be in the form: <configId=path>',
    );
  });

  it("throws on invalid --message-files entry (empty id)", () => {
    expect(() => normalizeMessageFiles(undefined, ["=path.json"])).toThrow();
  });

  it("throws on invalid --message-files entry (empty path)", () => {
    expect(() => normalizeMessageFiles(undefined, ["app="])).toThrow();
  });
});
