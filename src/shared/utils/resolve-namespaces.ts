import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type {
  LoaderOptions,
  RouteNamespaces,
} from "@/modules/config/types/loader.types";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { extractPathname, standardizePathname } from "@/shared/utils";

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
  const { loader } = config;
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
    `/${PREFIX_PLACEHOLDER}`,
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

  return matchedNamespaces.length > 0
    ? [...defaultNamespaces, ...matchedNamespaces]
    : [...defaultNamespaces];
};
