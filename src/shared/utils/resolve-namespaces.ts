import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import {
  LoaderOptions,
  RouteNamespaces,
} from "@/modules/config/types/loader.types";
import { extractPathname } from "@/shared/utils/pathname/extract-pathname";
import { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";

interface ResolveNamespacesOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

/**
 * Resolves namespaces based on pathname.
 * - 1. Exact match: Returns exact match namespaces.
 * - 2. Longest prefix match: Finds longest prefix using '/*'.
 * - 3. Fallback: Returns fallback namespaces if no match.
 */
export const resolveNamespaces = ({
  config,
  pathname,
}: ResolveNamespacesOptions): string[] => {
  const { loader, prefixPlaceHolder } = config;
  const {
    routeNamespaces = {} as RouteNamespaces,
    namespaces: fallbackNamespaces,
  } = loader as LoaderOptions;

  const { unprefixedPathname } = extractPathname({ config, pathname });

  const standardizedPathname = standardizePathname({
    config,
    pathname: unprefixedPathname,
  });

  const placeholderRemovedPathname = standardizedPathname.replace(
    `/${prefixPlaceHolder}`,
    "",
  );

  // Prepare default namespaces
  const defaultNamespaces: string[] = routeNamespaces.default ?? [];

  // 1. Exact match
  const exactMatchNamespaces =
    routeNamespaces[standardizedPathname] ??
    routeNamespaces[placeholderRemovedPathname];

  if (exactMatchNamespaces) {
    return [...defaultNamespaces, ...exactMatchNamespaces];
  }

  // 2. Prefix match (longest)
  let bestMatch = "";
  let bestNamespaces: string[] | undefined;

  const prefixPatterns = Object.keys(routeNamespaces).filter((pattern) =>
    pattern.endsWith("/*"),
  );

  for (const pattern of prefixPatterns) {
    const basePath = pattern.replace(/\/\*$/, "");
    if (standardizedPathname.startsWith(basePath)) {
      if (basePath.length > bestMatch.length) {
        bestMatch = basePath;
        bestNamespaces = routeNamespaces[pattern];
      }
    }
  }

  // 3. Fallback
  const matchedNamespaces: string[] =
    bestNamespaces ?? routeNamespaces["/*"] ?? fallbackNamespaces ?? [];

  if (matchedNamespaces.length > 0) {
    return [...defaultNamespaces, ...matchedNamespaces];
  } else {
    return [...defaultNamespaces];
  }
};
