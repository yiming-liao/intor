import { describe, it, expect } from "vitest";
import { none } from "../../../../../../src/routing/inbound/resolve-path/strategies";

describe("routing prefix strategy: none", () => {
  it("always passes without redirect", () => {
    expect(none()).toEqual({ type: "pass" });
  });
});
