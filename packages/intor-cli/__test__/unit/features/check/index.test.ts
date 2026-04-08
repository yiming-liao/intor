import { describe, expect, it } from "vitest";
import { check } from "../../../../src/features/check/check";

describe("check exports", () => {
  it("re-exports the check entry point", async () => {
    const mod = await import("../../../../src/features/check");

    expect(mod.check).toBe(check);
  });
});
