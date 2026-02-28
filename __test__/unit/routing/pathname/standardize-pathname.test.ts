import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect } from "vitest";
import { standardizePathname } from "../../../../src/routing/pathname/standardize-pathname";

describe("standardizePathname", () => {
  const withBasePath = {
    routing: { basePath: "/app" },
  } as unknown as IntorResolvedConfig;

  const rootBasePath = {
    routing: { basePath: "/" },
  } as unknown as IntorResolvedConfig;

  it("prepends basePath and locale placeholder to non-root canonical", () => {
    expect(standardizePathname("/home", withBasePath)).toBe(
      "/app/{locale}/home",
    );
  });

  it("handles nested canonical paths", () => {
    expect(standardizePathname("/a/b/c", withBasePath)).toBe(
      "/app/{locale}/a/b/c",
    );
  });

  it("handles root canonical with non-root basePath", () => {
    expect(standardizePathname("/", withBasePath)).toBe("/app/{locale}");
  });

  it("handles non-root canonical with root basePath", () => {
    expect(standardizePathname("/home", rootBasePath)).toBe("/{locale}/home");
  });

  it("handles root canonical with root basePath", () => {
    expect(standardizePathname("/", rootBasePath)).toBe("/{locale}");
  });
});
