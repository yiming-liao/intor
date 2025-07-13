import { DEFAULT_ROUTING_OPTIONS } from "@/modules/intor-config/constants/routing-options-constants";
import {
  InitRoutingOptions,
  ResolvedRoutingOptions,
} from "@/modules/intor-config/types/routing-options-types";
import { normalizePathname } from "@/shared/utils/pathname/normalize-pathname";

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
  routing: InitRoutingOptions = {},
): ResolvedRoutingOptions => {
  return {
    ...DEFAULT_ROUTING_OPTIONS,
    ...routing,
    firstVisit: {
      ...DEFAULT_ROUTING_OPTIONS.firstVisit,
      ...(routing.firstVisit || {}),
    },
    basePath: normalizePathname(routing?.basePath || ""),
  };
};
