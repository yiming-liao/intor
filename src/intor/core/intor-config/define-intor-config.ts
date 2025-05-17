import type {
  IntorInitConfig,
  IntorResolvedConfig,
} from "./types/define-intor-config-types";
import { initializeLogger } from "./initialize-logger";
import { resolveCookieOptions } from "./resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "./resolvers/resolve-fallback-locales";
import { resolvePrefixPlaceholder } from "./resolvers/resolve-prefix-placeholder";
import { resolveRoutingOptions } from "./resolvers/resolve-routing-options";
import { resolveTranslatorOptions } from "./resolvers/resolve-translator-options";
import { validateDefaultLocale } from "./validations/validate-default-locale";
import { validateSupportedLocales } from "./validations/validate-supported-locales";

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
    prefix: "defineIntorConfig",
  });

  // Validaters
  const supportedLocales = validateSupportedLocales({ config, logger });
  const defaultLocale = validateDefaultLocale({
    config,
    supportedLocales,
    logger,
  });

  // Resolvers
  const resolvedFallbackLocales = resolveFallbackLocales({
    config,
    supportedLocales,
    logger,
  });
  const resolvedTranslatorOptions = resolveTranslatorOptions(config.translator);
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
    translator: resolvedTranslatorOptions,
    cookie: resolvedCookieOptions,
    routing: resolvedRoutingOptions,
    adapter: config.adapter || "next-client",
    prefixPlaceHolder: resolvedPrefixPlaceHolder,
  };
};
