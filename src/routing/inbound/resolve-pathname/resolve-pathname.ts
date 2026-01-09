import type {
  PathnameContext,
  PathnameDirective,
  ResolvedPathname,
} from "./types";
import type { IntorResolvedConfig } from "@/config";
import { localizePathname } from "../../pathname";
import { all, exceptDefault, none } from "./strategies";

const assertNever = (x: never): never => {
  throw new Error(`Unhandled prefix strategy: ${x}`);
};

/**
 * Resolves the canonical pathname based on locale prefix behavior.
 *
 * The resolved pathname represents the final, normalized form
 * used for routing and navigation.
 */
export const resolvePathname = (
  config: IntorResolvedConfig,
  rawPathname: string,
  context: PathnameContext,
): ResolvedPathname => {
  const { localePrefix } = config.routing;

  let directive: PathnameDirective;
  switch (localePrefix) {
    case "all": {
      directive = all(config, context);
      break;
    }
    case "except-default": {
      directive = exceptDefault(config, context);
      break;
    }
    case "none": {
      directive = none();
      break;
    }
    default: {
      return assertNever(localePrefix);
    }
  }

  const { pathname } = localizePathname(rawPathname, config, context.locale);

  return {
    pathname,
    shouldRedirect: directive.type === "redirect",
  };
};
