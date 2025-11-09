import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";

describe("standardizePathname", () => {
  const config = {
    routing: {
      basePath: "/app",
    },
    prefixPlaceHolder: "{{locale}}",
  } as unknown as IntorResolvedConfig;

  it("should concatenate basePath, prefixPlaceHolder, and pathname correctly", () => {
    const result = standardizePathname({
      config,
      pathname: "home",
    });
    expect(result).toBe("/app/{{locale}}/home");
  });

  it("should handle empty pathname", () => {
    const result = standardizePathname({
      config,
      pathname: "",
    });
    expect(result).toBe("/app/{{locale}}");
  });

  it("should handle empty basePath", () => {
    const result = standardizePathname({
      config: {
        ...config,
        routing: {
          basePath: "",
        },
      } as unknown as IntorResolvedConfig,
      pathname: "home",
    });
    expect(result).toBe("/{{locale}}/home");
  });

  it("should handle empty prefixPlaceHolder", () => {
    const result = standardizePathname({
      config: {
        ...config,
        prefixPlaceHolder: "",
      },
      pathname: "home",
    });
    expect(result).toBe("/app/home");
  });

  it("should remove trailing slashes from the standardized pathname", () => {
    const result = standardizePathname({
      config,
      pathname: "home/",
    });
    expect(result).toBe("/app/{{locale}}/home");
  });

  it("should handle missing config values (basePath or prefixPlaceHolder)", () => {
    const result = standardizePathname({
      config: {
        routing: {
          basePath: "/app",
        },
        prefixPlaceHolder: "",
      } as unknown as IntorResolvedConfig,
      pathname: "home",
    });
    expect(result).toBe("/app/home");
  });

  it("should handle when pathname is an absolute path", () => {
    const result = standardizePathname({
      config,
      pathname: "/home",
    });
    expect(result).toBe("/app/{{locale}}/home");
  });

  it("should return basePath + prefixPlaceHolder if pathname is empty or undefined", () => {
    const result = standardizePathname({
      config,
      pathname: "",
    });
    expect(result).toBe("/app/{{locale}}");
  });

  it("should normalize pathnames with redundant slashes correctly", () => {
    const result = standardizePathname({
      config,
      pathname: "///home///",
    });
    expect(result).toBe("/app/{{locale}}/home");
  });

  it("should return only basePath + prefix when pathname is '/'", () => {
    const result = standardizePathname({
      config,
      pathname: "/",
    });
    expect(result).toBe("/app/{{locale}}");
  });

  it("should return only basePath when prefixPlaceHolder and pathname are empty", () => {
    const result = standardizePathname({
      config: {
        routing: { basePath: "/app" },
        prefixPlaceHolder: "",
      } as unknown as IntorResolvedConfig,
      pathname: "",
    });
    expect(result).toBe("/app");
  });

  it("should return '/' if all config values and pathname are empty", () => {
    const result = standardizePathname({
      config: {
        routing: { basePath: "" },
        prefixPlaceHolder: "",
      } as unknown as IntorResolvedConfig,
      pathname: "",
    });
    expect(result).toBe("/");
  });

  it("should handle segments that all start with slashes", () => {
    const result = standardizePathname({
      config: {
        routing: { basePath: "/app/" },
        prefixPlaceHolder: "/{{locale}}/",
      } as unknown as IntorResolvedConfig,
      pathname: "/home/",
    });
    expect(result).toBe("/app/{{locale}}/home");
  });
});
