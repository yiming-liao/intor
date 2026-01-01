import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { standardizePathname } from "@/routing/pathname/standardize-pathname";

describe("standardizePathname", () => {
  const config = {
    routing: {
      basePath: "/app",
    },
    prefixPlaceHolder: "{locale}",
  } as unknown as IntorResolvedConfig;

  it("should concatenate basePath, prefixPlaceHolder, and pathname correctly", () => {
    const result = standardizePathname(config, "home");
    expect(result).toBe("/app/{locale}/home");
  });

  it("should handle empty pathname", () => {
    const result = standardizePathname(config, "");
    expect(result).toBe("/app/{locale}");
  });

  it("should handle empty basePath", () => {
    const result = standardizePathname(
      {
        ...config,
        routing: { basePath: "" },
      } as unknown as IntorResolvedConfig,
      "home",
    );
    expect(result).toBe("/{locale}/home");
  });

  it("should remove trailing slashes from the standardized pathname", () => {
    const result = standardizePathname(config, "home/");
    expect(result).toBe("/app/{locale}/home");
  });

  it("should handle when pathname is an absolute path", () => {
    const result = standardizePathname(config, "/home");
    expect(result).toBe("/app/{locale}/home");
  });

  it("should return basePath + prefixPlaceHolder if pathname is empty or undefined", () => {
    const result = standardizePathname(config, "");
    expect(result).toBe("/app/{locale}");
  });

  it("should normalize pathnames with redundant slashes correctly", () => {
    const result = standardizePathname(config, "///home///");
    expect(result).toBe("/app/{locale}/home");
  });

  it("should return only basePath + prefix when pathname is '/'", () => {
    const result = standardizePathname(config, "/");
    expect(result).toBe("/app/{locale}");
  });

  it("should handle segments that all start with slashes", () => {
    const result = standardizePathname(
      {
        routing: { basePath: "/app/" },
        prefixPlaceHolder: "/{locale}/",
      } as unknown as IntorResolvedConfig,
      "/home/",
    );
    expect(result).toBe("/app/{locale}/home");
  });
});
