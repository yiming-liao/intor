import type {
  RoutingRawOptions,
  RoutingResolvedOptions,
} from "@/config/types/routing.types";
import { DEFAULT_ROUTING_OPTIONS } from "@/config/constants/routing.constants";
import { normalizePathname } from "@/shared/utils";

export const resolveRoutingOptions = (
  routing: RoutingRawOptions = {},
): RoutingResolvedOptions => {
  return {
    ...DEFAULT_ROUTING_OPTIONS,
    ...routing,
    firstVisit: {
      ...DEFAULT_ROUTING_OPTIONS.firstVisit,
      ...routing.firstVisit,
    },
    basePath: normalizePathname(routing?.basePath || ""),
  };
};
