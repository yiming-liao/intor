import type {
  InitRoutingOptions,
  ResolvedRoutingOptions,
} from "@/intor/core/intor-config/types/routing-options.types";
import { DEFAULT_ROUTING_OPTIONS } from "@/intor/constants/routing-options.constants";
import { EMPTY_OBJECT } from "@/intor/constants/shared.constants";
import { normalizePathname } from "@/intor/core/utils/pathname/normalize-pathname";

/**
 * Resolves routing options by merging default routing options with the provided custom options.
 * If any specific routing options are not provided, the default values will be used.
 * The function also normalizes the basePath if provided.
 *
 * @param {InitRoutingOptions} [routing={}] - The custom routing options to override the defaults.
 *   It should be an object that may contain properties like `firstVisit`, `basePath`, etc.
 *   If not provided, the default values will be used.
 * @returns {ResolvedRoutingOptions} - The resolved routing options, merged from the defaults and provided values.
 *   This includes the normalized `basePath` and any customized `firstVisit` settings.
 */
export const resolveRoutingOptions = (
  routing: InitRoutingOptions = EMPTY_OBJECT,
): ResolvedRoutingOptions => {
  return {
    ...DEFAULT_ROUTING_OPTIONS,
    ...routing,
    firstVisit: {
      ...DEFAULT_ROUTING_OPTIONS.firstVisit,
      ...(routing.firstVisit || EMPTY_OBJECT),
    },
    basePath: routing?.basePath
      ? normalizePathname(routing?.basePath ?? "") // Normalize the basePath if provided
      : "", // If no basePath, default to an empty string
  };
};
