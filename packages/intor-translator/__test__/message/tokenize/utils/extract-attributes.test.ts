import { describe, it, expect } from "vitest";
import { extractAttributes } from "../../../../src/message/tokenize/utils/extract-attributes";

describe("extractAttributes", () => {
  it("parses a single attribute", () => {
    const result = extractAttributes(' id="x"');
    expect(result).toEqual({
      id: "x",
    });
  });

  it("parses multiple attributes", () => {
    const result = extractAttributes(' id="x" href="/pricing"');
    expect(result).toEqual({
      id: "x",
      href: "/pricing",
    });
  });

  it("allows empty attribute values", () => {
    const result = extractAttributes(' id=""');
    expect(result).toEqual({
      id: "",
    });
  });

  it("returns null for unquoted values", () => {
    const result = extractAttributes(" id=x");
    expect(result).toBeNull();
  });

  it("returns null for single-quoted values", () => {
    const result = extractAttributes(" id='x'");
    expect(result).toBeNull();
  });

  it("returns null for boolean attributes", () => {
    const result = extractAttributes(" disabled");
    expect(result).toBeNull();
  });

  it("returns null for mixed valid and invalid attributes", () => {
    const result = extractAttributes(' id="x" disabled');
    expect(result).toBeNull();
  });

  it("returns null when attribute syntax is malformed", () => {
    const result = extractAttributes(' id="x"foo="y"');
    expect(result).toBeNull();
  });

  it("returns null when extra characters are present", () => {
    const result = extractAttributes(' id="x" >');
    expect(result).toBeNull();
  });

  it("returns an empty object for an empty attribute string", () => {
    const result = extractAttributes("");
    expect(result).toEqual({});
  });
});
