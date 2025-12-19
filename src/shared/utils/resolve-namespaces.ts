import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { standardizePathname } from "@/shared/utils/routing/standardize-pathname";

interface ResolveNamespacesOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

/**
 * Resolves namespaces based on pathname.
 */
export const resolveNamespaces = ({
  config,
  pathname,
}: ResolveNamespacesOptions): string[] | undefined => {
  const { loader } = config;
  const { routeNamespaces = {}, namespaces } = loader || {};

  if (Object.keys(routeNamespaces).length === 0 && !namespaces)
    return undefined;

  // "/{locale}/...", "__basePath__/{locale}/...""
  const standardizedPathname = standardizePathname({ config, pathname });
  // "/...", "__basePath__/...""
  const placeholderRemovedPathname = standardizedPathname.replace(
    `/${PREFIX_PLACEHOLDER}`,
    "",
  );

  const collected: string[] = [
    ...(routeNamespaces.default || []), // default
    ...(namespaces || []), // default
    ...(routeNamespaces[standardizedPathname] || []), // exact match
    ...(routeNamespaces[placeholderRemovedPathname] || []), // exact match
  ];

  const prefixPatterns = Object.keys(routeNamespaces).filter((pattern) =>
    pattern.endsWith("/*"),
  );

  for (const pattern of prefixPatterns) {
    const basePath = pattern.replace(/\/\*$/, "");
    if (
      standardizedPathname.startsWith(basePath) ||
      placeholderRemovedPathname.startsWith(basePath)
    ) {
      collected.push(...(routeNamespaces[pattern] || [])); // match pattern
    }
  }

  return [...new Set(collected)];
};
