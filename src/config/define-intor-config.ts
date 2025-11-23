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

export const defineIntorConfig = (
  config: IntorRawConfig,
): IntorResolvedConfig => {
  // Generate a random id if config.id is not defined
  const id = config.id || `ID${Math.random().toString(36).slice(2, 6)}`;

  // Validaters
  const supportedLocales = validateSupportedLocales(config);
  const defaultLocale = validateDefaultLocale(config, supportedLocales);

  // Resolvers
  const fallbackLocales = resolveFallbackLocales(config, supportedLocales);
  const cookie = resolveCookieOptions(config.cookie);
  const routing = resolveRoutingOptions(config.routing);
  const cache = resolveCacheOptions(config.cache);

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
    logger: config.logger,
    cache,
  };
};
