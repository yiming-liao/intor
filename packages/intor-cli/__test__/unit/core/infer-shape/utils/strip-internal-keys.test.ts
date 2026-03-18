/* eslint-disable @typescript-eslint/no-explicit-any */
import { INTOR_PREFIX } from "intor/internal";
import { describe, it, expect } from "vitest";
import { stripInternalKeys } from "../../../../../src/core/infer-shape/utils/strip-internal-keys";

describe("stripInternalKeys", () => {
  it("does nothing for non-object values", () => {
    const value = "hello";
    stripInternalKeys(value);
    expect(value).toBe("hello");
  });

  it("removes top-level internal keys", () => {
    const obj: any = {
      [`${INTOR_PREFIX}kind`]: "markdown",
      greeting: "hello",
    };
    stripInternalKeys(obj);
    expect(obj).toEqual({
      greeting: "hello",
    });
  });

  it("removes nested internal keys recursively", () => {
    const obj: any = {
      greeting: {
        [`${INTOR_PREFIX}kind`]: "markdown",
        content: "text",
      },
    };
    stripInternalKeys(obj);
    expect(obj).toEqual({
      greeting: {
        content: "text",
      },
    });
  });

  it("removes internal keys at multiple depths", () => {
    const obj: any = {
      [`${INTOR_PREFIX}root`]: true,
      section: {
        [`${INTOR_PREFIX}kind`]: "markdown",
        title: {
          [`${INTOR_PREFIX}flag`]: true,
          text: "hello",
        },
      },
    };
    stripInternalKeys(obj);
    expect(obj).toEqual({
      section: {
        title: {
          text: "hello",
        },
      },
    });
  });

  it("handles arrays by stripping internal keys from each item", () => {
    const obj: any = [
      {
        [`${INTOR_PREFIX}kind`]: "markdown",
        content: "a",
      },
      {
        value: "b",
        [`${INTOR_PREFIX}flag`]: true,
      },
    ];
    stripInternalKeys(obj);
    expect(obj).toEqual([{ content: "a" }, { value: "b" }]);
  });

  it("preserves non-internal keys even if similar", () => {
    const obj: any = {
      __intor: "should stay",
      __intorX: "should stay",
      [`${INTOR_PREFIX}kind`]: "markdown",
    };
    stripInternalKeys(obj);
    expect(obj).toEqual({
      __intor: "should stay",
      __intorX: "should stay",
    });
  });

  it("does not remove user-defined keys that only contain the prefix internally", () => {
    const obj: any = {
      greeting: {
        message: "__intor_kind is cool",
      },
    };
    stripInternalKeys(obj);
    expect(obj).toEqual({
      greeting: {
        message: "__intor_kind is cool",
      },
    });
  });

  it("works on inferred schema objects", () => {
    const schema: any = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            [`${INTOR_PREFIX}internal`]: { kind: "none" },
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    stripInternalKeys(schema);
    expect(schema).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    });
  });
});
