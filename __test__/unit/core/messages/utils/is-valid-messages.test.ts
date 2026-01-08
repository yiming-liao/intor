import { describe, it, expect } from "vitest";
import {
  isValidMessages,
  isPlainObject,
} from "@/core/messages/utils/is-valid-messages";

describe("isPlainObject", () => {
  it("returns true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject({ a: { b: 2 } })).toBe(true);
  });

  it("returns false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(["a"])).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("returns false for functions", () => {
    expect(isPlainObject(() => {})).toBe(false);
  });
});

describe("isValidMessages", () => {
  it("returns true for valid message trees with primitives", () => {
    const valid = {
      en: {
        text: "hello",
        count: 42,
        enabled: true,
        empty: null,
      },
    };
    expect(isValidMessages(valid)).toBe(true);
  });

  it("returns true for nested objects and arrays", () => {
    const valid = {
      en: {
        nested: {
          value: "ok",
          flags: [true, false],
          list: ["a", "b", "c"],
        },
      },
    };
    expect(isValidMessages(valid)).toBe(true);
  });

  it("returns false for unsupported leaf types", () => {
    const invalid1 = { en: { bad: () => {} } };
    const invalid2 = { en: { bad: Symbol("x") } };
    const invalid3 = { en: { bad: 1n } };
    expect(isValidMessages(invalid1)).toBe(false);
    expect(isValidMessages(invalid2)).toBe(false);
    expect(isValidMessages(invalid3)).toBe(false);
  });

  it("returns false when root is not an object", () => {
    expect(isValidMessages(null)).toBe(false);
    expect(isValidMessages(undefined)).toBe(false);
    expect(isValidMessages([])).toBe(false);
    expect(isValidMessages("string")).toBe(false);
  });

  it("handles deeply nested valid structures", () => {
    const deep = {
      en: {
        a: {
          b: {
            c: {
              d: ["x", { y: 1 }],
            },
          },
        },
      },
    };
    expect(isValidMessages(deep)).toBe(true);
  });
});
