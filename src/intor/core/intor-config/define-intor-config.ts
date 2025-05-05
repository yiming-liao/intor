import type {
  IntorInitConfig,
  IntorResolvedConfig,
} from "@/intor/core/intor-config/types/define-intor-config.types";
import { DEFAULT_PREFIX_PLACEHOLDER } from "@/intor/constants/prefix-placeholder.constants";
import { resolveCookieOptions } from "@/intor/core/intor-config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/intor/core/intor-config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "@/intor/core/intor-config/resolvers/resolve-routing-options";
import { resolveTranslatorOptions } from "@/intor/core/intor-config/resolvers/resolve-translator-options";
import { validateDefaultLocale } from "@/intor/core/intor-config/validations/validate-default-locale";
import { validateSupportedLocales } from "@/intor/core/intor-config/validations/validate-supported-locales";
import { getIntorLogger } from "@/intor/core/intor-logger/get-intor-logger";

/**
 * Define intor config
 */
export const defineIntorConfig = (
  config: IntorInitConfig,
): IntorResolvedConfig => {
  // Generate a random id if config.id is not defined
  const id = config.id || `ID${Math.random().toString(36).slice(2, 6)}`;

  // Initialize intorLogger
  const logger = getIntorLogger(id);
  logger.setLevel(config.log?.level || "warn");
  logger.setLogPrefix("defineIntorConfig");

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
    prefixPlaceHolder: config.prefixPlaceHolder ?? DEFAULT_PREFIX_PLACEHOLDER,
  };
};
