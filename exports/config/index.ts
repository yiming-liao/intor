/**
 * Global Config Module
 *
 * Exports all config-related utilities, constants, and types.
 * Separated for independent export, particularly for Edge environments.
 */

export {
  defineIntorConfig,

  // Constants
  DEFAULT_CACHE_OPTIONS,
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_ROUTING_OPTIONS,

  // Types
  type IntorRawConfig,
  type IntorResolvedConfig,
} from "@/modules/config";
