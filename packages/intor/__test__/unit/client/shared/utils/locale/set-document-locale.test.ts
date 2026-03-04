// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { setDocumentLocale } from "../../../../../../src/client/shared/utils";

describe("setDocumentLocale", () => {
  it("sets document.documentElement.lang in browser environment", () => {
    setDocumentLocale("en-US");
    expect(document.documentElement.lang).toBe("en-US");
  });

  it("does nothing when document is undefined", () => {
    const original = globalThis.document;
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      configurable: true,
    });
    expect(() => setDocumentLocale("en-US")).not.toThrow();
    Object.defineProperty(globalThis, "document", {
      value: original,
      configurable: true,
    });
  });
});
