import type { IntorResolvedConfig } from "../../../src/intor/core/intor-config/types/define-intor-config-types";
import { resolveNamespaces } from "../../../src/intor/core/utils/resolve-namespaces";

const baseConfig = {
  prefixPlaceHolder: "[locale]",
  loaderOptions: {
    routeNamespaces: {
      default: ["ui", "error"],
      "/cms": ["cms"],
      "/cms/dashboard": ["cms-dashboard"],
      "/blog/*": ["blog"],
      "/*": ["global"],
      "/api": [],
    },
    namespaces: ["fallback"],
  },
} as unknown as IntorResolvedConfig;

jest.mock("../../../src/intor/core/utils/pathname/extract-pathname", () => ({
  extractPathname: jest.fn(({ pathname }) => ({
    unprefixedPathname: pathname,
  })),
}));

jest.mock(
  "../../../src/intor/core/utils/pathname/standardize-pathname",
  () => ({
    standardizePathname: jest
      .fn()
      .mockImplementation(({ pathname }) => pathname),
  }),
);

describe("resolveNamespaces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return default + exact match namespaces", () => {
    const result = resolveNamespaces({ config: baseConfig, pathname: "/cms" });
    expect(result).toEqual(["ui", "error", "cms"]);
  });

  it("should return default + exact nested match namespaces", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/cms/dashboard",
    });
    expect(result).toEqual(["ui", "error", "cms-dashboard"]);
  });

  it("should return default + prefix match namespaces (longest match)", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/blog/article/123",
    });
    expect(result).toEqual(["ui", "error", "blog"]);
  });

  it("should return default + global fallback if no match", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/unknown",
    });
    expect(result).toEqual(["ui", "error", "global"]);
  });

  it("should return only default if exact match is []", () => {
    const result = resolveNamespaces({ config: baseConfig, pathname: "/api" });
    expect(result).toEqual(["ui", "error"]);
  });

  it("should return default + global fallback if no match", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/something",
    });
    expect(result).toEqual(["ui", "error", "global"]);
  });

  it("should return [] if no match and no default", () => {
    const configEmpty = {
      prefixPlaceHolder: "__",
      loaderOptions: {
        routeNamespaces: {},
        namespaces: undefined,
      },
    } as unknown as IntorResolvedConfig;

    const result = resolveNamespaces({
      config: configEmpty,
      pathname: "/something",
    });

    expect(result).toEqual([]);
  });

  it("should return fallback only when no match and default is undefined", () => {
    const config: IntorResolvedConfig = {
      prefixPlaceHolder: "__",
      loaderOptions: {
        routeNamespaces: {},
        namespaces: ["fallbackOnly"],
      },
    } as unknown as IntorResolvedConfig;

    const result = resolveNamespaces({
      config,
      pathname: "/not-found",
    });

    expect(result).toEqual(["fallbackOnly"]);
  });
});
