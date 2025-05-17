import type { IntorResolvedConfig } from "../../../../src/intor/core/intor-config/types/define-intor-config-types";
import { extractPathname } from "../../../../src/intor/core/utils/pathname/extract-pathname";
import { localePrefixPathname } from "../../../../src/intor/core/utils/pathname/locale-prefix-pathname";
import { localizePathname } from "../../../../src/intor/core/utils/pathname/localize-pathname";
import { standardizePathname } from "../../../../src/intor/core/utils/pathname/standardize-pathname";

jest.mock("../../../../src/intor/core/utils/pathname/extract-pathname");
jest.mock("../../../../src/intor/core/utils/pathname/standardize-pathname");
jest.mock("../../../../src/intor/core/utils/pathname/locale-prefix-pathname");

const baseConfig = {
  defaultLocale: "en",
  prefixPlaceHolder: "{{locale}}",
  routing: {
    prefix: "all",
  },
} as unknown as IntorResolvedConfig;

describe("localizePathname", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct unprefixed, standardized, and locale-prefixed pathnames", () => {
    (extractPathname as jest.Mock).mockReturnValue({
      unprefixedPathname: "/app/{{locale}}/home",
    });
    (standardizePathname as jest.Mock).mockReturnValue("/app/{{locale}}/home");
    (localePrefixPathname as jest.Mock).mockReturnValue("/app/fr/home");

    const result = localizePathname({
      config: baseConfig,
      pathname: "/app/fr/home",
      locale: "fr",
    });

    expect(extractPathname).toHaveBeenCalledWith({
      config: baseConfig,
      pathname: "/app/fr/home",
    });

    expect(standardizePathname).toHaveBeenCalledWith({
      config: baseConfig,
      pathname: "/app/{{locale}}/home",
    });

    expect(localePrefixPathname).toHaveBeenCalledWith({
      config: baseConfig,
      pathname: "/app/{{locale}}/home",
      locale: "fr",
    });

    expect(result).toEqual({
      unprefixedPathname: "/app/{{locale}}/home",
      standardizedPathname: "/app/{{locale}}/home",
      localePrefixedPathname: "/app/fr/home",
    });
  });

  it('should work correctly when prefix is "none"', () => {
    const config = {
      ...baseConfig,
      routing: { prefix: "none" },
    } as unknown as IntorResolvedConfig;

    (extractPathname as jest.Mock).mockReturnValue({
      unprefixedPathname: "/about",
    });
    (standardizePathname as jest.Mock).mockReturnValue("/about");
    (localePrefixPathname as jest.Mock).mockReturnValue("/about");

    const result = localizePathname({
      config,
      pathname: "/about",
      locale: "fr",
    });

    expect(localePrefixPathname).toHaveBeenCalledWith({
      config,
      pathname: "/about",
      locale: "fr",
    });

    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/about",
      localePrefixedPathname: "/about",
    });
  });

  it('should throw if locale is missing and prefix is "all"', () => {
    (extractPathname as jest.Mock).mockReturnValue({
      unprefixedPathname: "/contact",
    });
    (standardizePathname as jest.Mock).mockReturnValue("/contact");

    (localePrefixPathname as jest.Mock).mockImplementation(() => {
      throw new Error('No locale when using prefix "all", "except-default"');
    });

    expect(() =>
      localizePathname({
        config: baseConfig,
        pathname: "/contact",
        locale: undefined,
      }),
    ).toThrow('No locale when using prefix "all", "except-default"');
  });
});
