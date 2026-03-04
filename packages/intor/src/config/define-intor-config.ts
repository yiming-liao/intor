import type { IntorRawConfig } from "../config";
import type { IntorConfig } from "./types/intor-config";
import { resolveCookieOptions } from "../config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "../config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "../config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "../config/validators/validate-default-locale";
import { validateId } from "../config/validators/validate-id";
import { validateSupportedLocales } from "../config/validators/validate-supported-locales";

/**
 * Defines the canonical Intor configuration.
 *
 * This is the primary entry point for creating a validated,
 * runtime-ready Intor configuration.
 *
 * It transforms a user-provided raw config into a normalized form by:
 * - enforcing required invariants
 * - resolving derived options
 * - applying stable defaults
 *
 * This function is pure and side-effect free.
 *
 * @public
 */
export const defineIntorConfig = (config: IntorRawConfig): IntorConfig => {
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
    ...(config.messages !== undefined ? { messages: config.messages } : {}),
    ...(config.loader !== undefined ? { loader: config.loader } : {}),
    defaultLocale,
    supportedLocales,
    fallbackLocales,
    ...(config.translator !== undefined
      ? { translator: config.translator }
      : {}),
    cookie,
    routing,
    logger: { id, ...config.logger },
    ...(config.client !== undefined ? { client: config.client } : {}),
    ...(config.server !== undefined ? { server: config.server } : {}),
  };
};
