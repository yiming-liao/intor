import type { IntorResolvedConfig } from "../../../../src/intor/core/intor-config/types/define-intor-config-types";
import { localePrefixPathname } from "../../../../src/intor/core/utils/pathname/locale-prefix-pathname";

describe("localePrefixPathname", () => {
  const baseConfig = {
    defaultLocale: "en",
    prefixPlaceHolder: "{{locale}}",
    routing: {
      prefix: "all",
    },
  } as unknown as IntorResolvedConfig;

  it('should replace prefix placeholder with locale for "all" prefix', () => {
    const result = localePrefixPathname({
      pathname: "/app/{{locale}}/home",
      config: baseConfig,
      locale: "fr",
    });
    expect(result).toBe("/app/fr/home");
  });

  it('should replace prefix placeholder with locale for "except-default" prefix when locale is not default', () => {
    const result = localePrefixPathname({
      pathname: "/app/{{locale}}/home",
      config: {
        ...baseConfig,
        routing: { ...baseConfig.routing, prefix: "except-default" },
      },
      locale: "fr",
    });
    expect(result).toBe("/app/fr/home");
  });

  it('should not replace prefix placeholder for "except-default" when locale is default', () => {
    const result = localePrefixPathname({
      pathname: "/app/{{locale}}/home",
      config: {
        ...baseConfig,
        routing: { ...baseConfig.routing, prefix: "except-default" },
      },
      locale: "en",
    });
    expect(result).toBe("/app/home");
  });

  it('should remove prefix placeholder for "none" prefix', () => {
    const result = localePrefixPathname({
      pathname: "/app/{{locale}}/home",
      config: {
        ...baseConfig,
        routing: { ...baseConfig.routing, prefix: "none" },
      },
      locale: "fr",
    });
    expect(result).toBe("/app/home");
  });

  it('should throw an error if locale is missing when prefix is "all" or "except-default"', () => {
    expect(() => {
      localePrefixPathname({
        pathname: "/app/{{locale}}/home",
        config: baseConfig,
        locale: undefined,
      });
    }).toThrow('No locale when using prefix "all", "except-default"');
  });

  it('should not throw an error if locale is present when prefix is "all" or "except-default"', () => {
    expect(() => {
      localePrefixPathname({
        pathname: "/app/{{locale}}/home",
        config: baseConfig,
        locale: "fr",
      });
    }).not.toThrow();
  });

  it('should throw an error if locale is an empty string when prefix is "all" or "except-default"', () => {
    expect(() => {
      localePrefixPathname({
        pathname: "/app/{{locale}}/home",
        config: baseConfig,
        locale: "",
      });
    }).toThrow('No locale when using prefix "all", "except-default"');
  });
});
