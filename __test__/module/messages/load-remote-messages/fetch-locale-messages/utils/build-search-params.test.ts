import { describe, it, expect } from "vitest";
import { buildSearchParams } from "@/modules/messages/load-remote-messages/fetch-locale-messages/utils/build-search-params";

describe("buildSearchParams", () => {
  it("should handle simple string values", () => {
    const params = { foo: "bar", baz: "qux" };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("foo=bar&baz=qux");
  });

  it("should handle array values", () => {
    const params = { tags: ["a", "b", "c"] };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("tags=a&tags=b&tags=c");
  });

  it("should ignore undefined or null values", () => {
    const params = { a: undefined, b: null, c: "valid" };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("c=valid");
  });

  it("should ignore empty array values", () => {
    const params = { empty: [], valid: ["ok"] };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("valid=ok");
  });

  it("should handle mix of string, array, undefined, null", () => {
    const params = {
      name: "alice",
      roles: ["admin", ""],
      empty: [],
      skip: undefined,
      none: null,
    };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("name=alice&roles=admin");
  });

  it("should allow empty string if needed", () => {
    const params = { emptyStr: "" };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("emptyStr=");
  });

  it("should handle multiple keys and mixed types", () => {
    const params = {
      a: "1",
      b: ["2", "3"],
      c: undefined,
      d: null,
      e: ["4", ""],
    };
    const searchParams = buildSearchParams(params);
    expect(searchParams.toString()).toBe("a=1&b=2&b=3&e=4");
  });
});
