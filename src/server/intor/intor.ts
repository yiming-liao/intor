import type { LocaleResolver, IntorValue } from "./types";
import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import {
  getLogger,
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
  type MessagesReaders,
} from "@/core";
import { initTranslator } from "../translator";

/**
 * Initializes Intor for the current execution context.
 *
 * Produces a server-side snapshot for SSR and
 * full-stack rendering environments.
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  localeOrResolver: LocaleResolver | Locale,
  options?: { readers?: MessagesReaders; allowCacheWrite?: boolean },
): Promise<IntorValue<CK>> {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");

  // Resolve locale
  const isLocaleFunction = typeof localeOrResolver === "function";
  const locale = isLocaleFunction
    ? await localeOrResolver(config)
    : localeOrResolver || config.defaultLocale;
  const source = typeof localeOrResolver === "function" ? "resolver" : "static";
  logger.debug(`Initial locale resolved as "${locale}" via "${source}".`);

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    readers: options?.readers,
    allowCacheWrite: options?.allowCacheWrite,
  });

  logger.info("Intor initialized.");

  return {
    config,
    locale: translator.locale as GenLocale<CK>,
    messages: translator.messages as Readonly<GenMessages<CK>>,
  };
}
