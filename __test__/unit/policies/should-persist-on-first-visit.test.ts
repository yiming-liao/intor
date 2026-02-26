import { describe, it, expect } from "vitest";
import { shouldPersistOnFirstVisit } from "../../../src/policies/should-persist-on-first-visit";

describe("shouldPersistOnFirstVisit", () => {
  it("returns false when first visit and persistOnFirstVisit is false", () => {
    const result = shouldPersistOnFirstVisit(true, false);
    expect(result).toBe(false);
  });

  it("returns true when first visit and persistOnFirstVisit is true", () => {
    const result = shouldPersistOnFirstVisit(true, true);
    expect(result).toBe(true);
  });

  it("returns true when not first visit regardless of persist flag (false)", () => {
    const result = shouldPersistOnFirstVisit(false, false);
    expect(result).toBe(true);
  });

  it("returns true when not first visit and persist flag is true", () => {
    const result = shouldPersistOnFirstVisit(false, true);
    expect(result).toBe(true);
  });
});
