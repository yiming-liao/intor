import type {
  IntorInitConfig,
  IntorResolvedConfig,
} from "@/modules/intor-config/types/define-intor-config-types";
import { initializeLogger } from "@/modules/intor-config/initialize-logger";
import { resolveCookieOptions } from "@/modules/intor-config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/modules/intor-config/resolvers/resolve-fallback-locales";
import { resolvePrefixPlaceholder } from "@/modules/intor-config/resolvers/resolve-prefix-placeholder";
import { resolveRoutingOptions } from "@/modules/intor-config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "@/modules/intor-config/validators/validate-default-locale";
import { validateSupportedLocales } from "@/modules/intor-config/validators/validate-supported-locales";

/**
 * Define intor config
 */
export const defineIntorConfig = (
  config: IntorInitConfig,
): IntorResolvedConfig => {
  // Generate a random id if config.id is not defined
  const id = config.id || `ID${Math.random().toString(36).slice(2, 6)}`;

  // Initialize intorLogger
  const logger = initializeLogger({
    id,
    loggerOptions: config.logger,
    scope: "defineIntorConfig",
  });

  // Validaters
  const supportedLocales = validateSupportedLocales({ config });
  const defaultLocale = validateDefaultLocale({ config, supportedLocales });

  // Resolvers
  const resolvedFallbackLocales = resolveFallbackLocales({
    config,
    supportedLocales,
    logger,
  });
  const resolvedCookieOptions = resolveCookieOptions(config.cookie);
  const resolvedRoutingOptions = resolveRoutingOptions(config.routing);
  const resolvedPrefixPlaceHolder = resolvePrefixPlaceholder(
    config.prefixPlaceHolder,
  );

  return {
    id,
    messages: config.messages, // Optional
    loaderOptions: config.loaderOptions, // Optional
    defaultLocale, // Validated
    supportedLocales, // Validated
    fallbackLocales: resolvedFallbackLocales,
    translator: config.translator,
    cookie: resolvedCookieOptions,
    routing: resolvedRoutingOptions,
    adapter: config.adapter || "next-client",
    prefixPlaceHolder: resolvedPrefixPlaceHolder,
  };
};
