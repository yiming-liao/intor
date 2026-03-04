import type { Locale } from "intor-translator";

interface CollectRemoteResourcesParams {
  locale: Locale;
  baseUrl: string;
  namespaces?: string[];
}

/**
 * Collect remote message resources for a given locale.
 *
 * - Always includes the root `index.json`
 * - Optionally includes namespace-specific resources
 * - Produces semantic paths for later message nesting
 *
 * This function performs no I/O and does not validate resource existence.
 */
export function collectRemoteResources({
  locale,
  baseUrl,
  namespaces,
}: CollectRemoteResourcesParams): Array<{ url: string; path: string[] }> {
  const basePath = `${baseUrl}/${locale}`;

  // Root translation resource (always loaded)
  const indexResource = { url: `${basePath}/index.json`, path: [] };

  // When no namespaces are provided, the locale domain consists of index only
  if (!namespaces || namespaces.length === 0) return [indexResource];

  // Namespace-specific resources are nested under their namespace key
  const nsResources = namespaces.map((ns) => ({
    url: `${basePath}/${ns}.json`,
    path: [ns],
  }));

  return [indexResource, ...nsResources];
}
