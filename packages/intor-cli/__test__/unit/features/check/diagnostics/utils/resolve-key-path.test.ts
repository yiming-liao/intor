import { describe, it, expect } from "vitest";
import { resolveKeyPath } from "../../../../../../src/features/check/diagnostics/utils/resolve-key-path";

describe("resolveKeyPath", () => {
  it("returns the key when preKey is not provided", () => {
    expect(resolveKeyPath("greeting")).toBe("greeting");
  });

  it("returns the preKey when key is empty", () => {
    expect(resolveKeyPath("", "home")).toBe("home");
  });

  it("joins preKey and key with a dot", () => {
    expect(resolveKeyPath("greeting", "home")).toBe("home.greeting");
  });
});
