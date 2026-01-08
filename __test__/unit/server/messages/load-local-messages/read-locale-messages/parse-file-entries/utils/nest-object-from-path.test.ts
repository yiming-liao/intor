import type { MessageObject } from "intor-translator";
import { describe, it, expect } from "vitest";
import { nestObjectFromPath } from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries/utils/nest-object-from-path";

describe("nestObjectFromPath", () => {
  it("should return value directly if path is empty", () => {
    const value: MessageObject = { a: "A" };
    const result = nestObjectFromPath([], value);
    expect(result).toEqual({ a: "A" });
  });

  it("should wrap value with a single key", () => {
    const value: MessageObject = { b: "B" };
    const result = nestObjectFromPath(["ui"], value);
    expect(result).toEqual({ ui: { b: "B" } });
  });

  it("should nest value correctly for multiple path segments", () => {
    const value: MessageObject = { d: "D" };
    const result = nestObjectFromPath(["auth", "verify"], value);
    expect(result).toEqual({ auth: { verify: { d: "D" } } });
  });

  it("should work with numbers or other strings as keys", () => {
    const value: MessageObject = { x: "1" };
    const result = nestObjectFromPath(["level1", "level2", "3"], value);
    expect(result).toEqual({ level1: { level2: { "3": { x: "1" } } } });
  });
});
