import type {
  IntorRawConfig,
  IntorResolvedConfig,
} from "@/config/types/intor-config.types";
import { resolveCacheOptions } from "@/config/resolvers/resolve-cache-options";
import { resolveCookieOptions } from "@/config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "@/config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "@/config/validators/validate-default-locale";
import { validateSupportedLocales } from "@/config/validators/validate-supported-locales";

/**
 * Defines and resolves an Intor configuration.
 *
 * This is the canonical entry point for transforming a raw configuration
 * into a fully validated and resolved Intor config.
 *
 * Responsibilities:
 * - Validate required invariants
 * - Resolve and normalize derived options
 * - Apply stable defaults
 *
 * This function is purely declarative and side-effect free.
 * It does not create runtime instances or attach dynamic behavior.
 *
 * Intended to run once during application initialization.
 */
export const defineIntorConfig = (
  config: IntorRawConfig,
): IntorResolvedConfig => {
  // Validators
  const supportedLocales = validateSupportedLocales(config);
  const defaultLocale = validateDefaultLocale(config, supportedLocales);

  // Resolvers
  const fallbackLocales = resolveFallbackLocales(config, supportedLocales);
  const cookie = resolveCookieOptions(config.cookie);
  const routing = resolveRoutingOptions(config.routing);
  const cache = resolveCacheOptions(config.cache);

  return {
    id: config.id ?? "default",
    messages: config.messages,
    loader: config.loader,
    defaultLocale,
    supportedLocales,
    fallbackLocales,
    translator: config.translator,
    cookie,
    routing,
    logger: config.logger,
    cache,
  };
};
