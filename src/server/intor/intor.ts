import type { IntorValue } from "./types";
import type { IntorConfig } from "../../config";
import {
  getLogger,
  type GenConfigKeys,
  type GenLocale,
  type MessagesReaders,
  type RuntimeFetch,
} from "../../core";
import { initTranslator } from "../translator";

/**
 * Initializes Intor for the current execution context.
 *
 * Produces a server-side snapshot for SSR and
 * full-stack rendering environments.
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
  locale: GenLocale<CK> | (string & {}),
  options?: {
    readers?: MessagesReaders;
    allowCacheWrite?: boolean;
    fetch?: RuntimeFetch;
  },
): Promise<IntorValue<CK>> {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");
  logger.debug(`Initializing Intor with locale "${locale}".`);

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    ...(options?.readers !== undefined ? { readers: options?.readers } : {}),
    allowCacheWrite: options?.allowCacheWrite ?? true,
    fetch: options?.fetch ?? globalThis.fetch,
  });

  logger.info("Intor initialized.");

  return {
    config,
    locale: translator.locale,
    messages: translator.messages,
  };
}
