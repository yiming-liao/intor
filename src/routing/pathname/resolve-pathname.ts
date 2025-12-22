import type { IntorResolvedConfig } from "@/config";
import type {
  PathnameContext,
  PathnameDirective,
  ResolvedPathname,
} from "@/routing/pathname/types";
import { all, exceptDefault, none } from "@/routing/pathname/strategies/";
import { localizePathname } from "@/shared/utils";

const assertNever = (x: never): never => {
  throw new Error(`Unhandled prefix strategy: ${x}`);
};

/**
 * Resolve the final pathname based on routing configuration.
 *
 * - This function determines how locale prefixes should be
 * applied to the given pathname based on `config.routing.prefix`.
 *
 * - It delegates the decision to a corresponding prefix
 * strategy (`all`, `except-default`, or `none`) and derives
 * a routing directive from the current pathname context.
 *
 * - The pathname is then localized into its final form,
 * producing a single canonical pathname for the routing flow.
 *
 * - The result also indicates whether a redirect is required
 * to reach the resolved pathname.
 */
export const resolvePathname = (
  config: IntorResolvedConfig,
  pathname: string,
  context: PathnameContext,
): ResolvedPathname => {
  const { prefix } = config.routing;

  let directive: PathnameDirective;
  switch (prefix) {
    case "all": {
      directive = all(context, config);
      break;
    }
    case "except-default": {
      directive = exceptDefault(context, config);
      break;
    }
    case "none": {
      directive = none(context);
      break;
    }
    default: {
      return assertNever(prefix);
    }
  }

  const { localizedPathname } = localizePathname({
    config,
    pathname,
    locale: context.locale,
  });

  return {
    pathname: localizedPathname,
    shouldRedirect: directive.type === "redirect",
  };
};
