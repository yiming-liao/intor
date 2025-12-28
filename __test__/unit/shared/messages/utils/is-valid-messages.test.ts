import { describe, it, expect } from "vitest";
import {
  isValidMessages,
  isPlainObject,
} from "@/shared/messages/utils/is-valid-messages";

describe("isPlainObject", () => {
  it("should return true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject({ a: { b: 2 } })).toBe(true);
  });

  it("should return false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(["a"])).toBe(false);
  });

  it("should return false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("should return false for primitives", () => {
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isPlainObject(() => {})).toBe(false);
  });
});

describe("isValidMessages", () => {
  it("should return true for valid NamespaceMessages", () => {
    const valid1 = { en: { hello: "Hello" } };
    const valid2 = { en: { nested: { world: "World" } } };
    expect(isValidMessages(valid1)).toBe(true);
    expect(isValidMessages(valid2)).toBe(true);
  });

  it("should return false if any value is not string or object", () => {
    const invalid1 = { en: { hello: 123 } };
    const invalid2 = { en: { nested: { world: [] } } };
    const invalid3 = { en: null };
    const invalid4 = ["not", "object"];
    const invalid5 = "string";

    expect(isValidMessages(invalid1)).toBe(false);
    expect(isValidMessages(invalid2)).toBe(false);
    expect(isValidMessages(invalid3)).toBe(false);
    expect(isValidMessages(invalid4)).toBe(false);
    expect(isValidMessages(invalid5)).toBe(false);
  });

  it("should handle deeply nested valid objects", () => {
    const deep = { en: { a: { b: { c: { d: "e" } } } } };
    expect(isValidMessages(deep)).toBe(true);
  });

  it("should return false for empty array", () => {
    expect(isValidMessages([])).toBe(false);
  });

  it("should return false for null or undefined", () => {
    expect(isValidMessages(null)).toBe(false);
    expect(isValidMessages(undefined)).toBe(false);
  });
});
