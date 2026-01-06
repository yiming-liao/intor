import type { IntorRawConfig, IntorResolvedConfig } from "@/config";
import { resolveCookieOptions } from "@/config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "@/config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "@/config/validators/validate-default-locale";
import { validateId } from "@/config/validators/validate-id";
import { validateSupportedLocales } from "@/config/validators/validate-supported-locales";

/**
 * Defines the canonical Intor configuration.
 *
 * Transforms a raw config into a validated and runtime-ready form by:
 * - enforcing required invariants
 * - resolving derived options
 * - applying stable defaults
 *
 * This function is declarative and side-effect free.
 */
export const defineIntorConfig = (
  config: IntorRawConfig,
): IntorResolvedConfig => {
  // -----------------------------------------------------------------------------
  // Validators
  // -----------------------------------------------------------------------------
  const id = validateId(config.id ?? "default");
  const supportedLocales = validateSupportedLocales(
    id,
    config.supportedLocales,
  );
  const supportedSet = new Set(supportedLocales);
  const defaultLocale = validateDefaultLocale(
    id,
    config.defaultLocale,
    supportedSet,
  );

  // -----------------------------------------------------------------------------
  // Resolvers
  // -----------------------------------------------------------------------------
  const fallbackLocales = resolveFallbackLocales(config, id, supportedSet);
  const cookie = resolveCookieOptions(config.cookie);
  const routing = resolveRoutingOptions(config.routing);

  return {
    id,
    messages: config.messages,
    loader: config.loader,
    defaultLocale,
    supportedLocales,
    fallbackLocales,
    translator: config.translator,
    cookie,
    routing,
    logger: { id, ...config.logger },
    client: config.client,
    server: config.server,
  };
};
