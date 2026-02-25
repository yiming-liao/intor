import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect } from "vitest";
import { standardizePathname } from "../../../../src/routing/pathname/standardize-pathname";

describe("standardizePathname", () => {
  const config = {
    routing: {
      basePath: "/app",
    },
    prefixPlaceHolder: "{locale}",
  } as unknown as IntorResolvedConfig;

  it("should concatenate basePath, prefixPlaceHolder, and pathname correctly", () => {
    const result = standardizePathname("home", config);
    expect(result).toBe("/app/{locale}/home");
  });

  it("should handle empty pathname", () => {
    const result = standardizePathname("", config);
    expect(result).toBe("/app/{locale}");
  });

  it("should handle empty basePath", () => {
    const result = standardizePathname("home", {
      ...config,
      routing: { basePath: "" },
    } as unknown as IntorResolvedConfig);
    expect(result).toBe("/{locale}/home");
  });

  it("should remove trailing slashes from the standardized pathname", () => {
    const result = standardizePathname("home/", config);
    expect(result).toBe("/app/{locale}/home");
  });

  it("should handle when pathname is an absolute path", () => {
    const result = standardizePathname("/home", config);
    expect(result).toBe("/app/{locale}/home");
  });

  it("should return basePath + prefixPlaceHolder if pathname is empty or undefined", () => {
    const result = standardizePathname("", config);
    expect(result).toBe("/app/{locale}");
  });

  it("should normalize pathnames with redundant slashes correctly", () => {
    const result = standardizePathname("///home///", config);
    expect(result).toBe("/app/{locale}/home");
  });

  it("should return only basePath + prefix when pathname is '/'", () => {
    const result = standardizePathname("/", config);
    expect(result).toBe("/app/{locale}");
  });

  it("should handle segments that all start with slashes", () => {
    const result = standardizePathname("/home/", {
      routing: { basePath: "/app/" },
      prefixPlaceHolder: "/{locale}/",
    } as unknown as IntorResolvedConfig);
    expect(result).toBe("/app/{locale}/home");
  });
});
