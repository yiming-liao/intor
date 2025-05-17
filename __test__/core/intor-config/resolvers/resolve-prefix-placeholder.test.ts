import { DEFAULT_PREFIX_PLACEHOLDER } from "../../../../src/intor/constants/prefix-placeholder-constants";
import { resolvePrefixPlaceholder } from "../../../../src/intor/core/intor-config/resolvers/resolve-prefix-placeholder";

describe("resolvePrefixPlaceholder", () => {
  it("should remove all slashes from the input string", () => {
    const result = resolvePrefixPlaceholder("/__prefix/");
    expect(result).toBe("__prefix");
  });

  it("should return the default placeholder when input is an empty string", () => {
    const result = resolvePrefixPlaceholder("");
    expect(result).toBe(DEFAULT_PREFIX_PLACEHOLDER);
  });

  it("should return the default placeholder when input is undefined", () => {
    const result = resolvePrefixPlaceholder(undefined);
    expect(result).toBe(DEFAULT_PREFIX_PLACEHOLDER);
  });
});
