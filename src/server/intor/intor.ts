import type { IntorResolvedConfig } from "@/config";
import type { IntorResult, LocaleResolver } from "@/server/intor/types";
import type { MessagesReader } from "@/shared/messages";
import type { GenConfigKeys, GenLocale } from "@/shared/types";
import type { LocaleMessages } from "intor-translator";
import { loadMessages } from "@/server/messages";
import { getLogger } from "@/shared/logger";
import { deepMerge } from "@/shared/utils";
import { resolveLoaderOptions } from "@/shared/utils";

/**
 * Entry point for initializing Intor.
 *
 * This function orchestrates the initialization flow:
 *
 * - Resolves the initial locale using a provided locale resolver
 * - Loads locale messages if the message loader is enabled
 * - Returns a fully-initialized Intor result
 *
 * This function does not perform routing decisions itself.
 * Locale resolution is delegated to the provided `getLocale` implementation.
 */
export const intor = async <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  getLocale: LocaleResolver<CK> | GenLocale<CK>,
  loadMessagesOptions: {
    exts?: string[];
    messagesReader?: MessagesReader;
  } = {},
): Promise<IntorResult<CK>> => {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");

  // Resolve initial locale
  const isLocaleFunction = typeof getLocale === "function";
  const locale = isLocaleFunction
    ? await getLocale(config)
    : getLocale || config.defaultLocale;
  const source = typeof getLocale === "function" ? "resolver" : "static";
  logger.debug(`Initial locale resolved as "${locale}" via "${source}".`);

  // Load messages during initialization when a loader is configured.
  let loadedMessages: LocaleMessages | undefined;
  const loader = resolveLoaderOptions(config, "server");
  if (loader) {
    loadedMessages = await loadMessages({
      config,
      locale,
      extraOptions: {
        exts: loadMessagesOptions.exts,
        messagesReader: loadMessagesOptions.messagesReader,
      },
      allowCacheWrite: true, // Intor is the primary cache writer during initialization.
    });
  }

  logger.info("Intor initialized.");
  return {
    config,
    initialLocale: locale as GenLocale<CK>,
    initialMessages: deepMerge(config.messages, loadedMessages),
  };
};
