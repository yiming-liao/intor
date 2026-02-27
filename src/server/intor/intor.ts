import type { IntorOptions, IntorValue } from "./types";
import type { IntorConfig } from "../../config";
import { getLogger, type TypedConfigKeys } from "../../core";
import { initTranslator } from "../translator";

/**
 * Initializes Intor for the current execution context.
 *
 * Produces a server-side snapshot for SSR and
 * full-stack rendering environments.
 *
 * @public
 */
export async function intor<CK extends TypedConfigKeys = "__default__">(
  config: IntorConfig,
  locale: string,
  options?: IntorOptions,
): Promise<IntorValue<CK>> {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");
  logger.debug(`Initializing Intor with locale "${locale}".`);

  const {
    readers,
    allowCacheWrite = true,
    fetch = globalThis.fetch,
  } = options ?? {};

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    ...(readers !== undefined ? { readers: readers } : {}),
    allowCacheWrite,
    fetch,
  });

  logger.info("Intor initialized.");

  return {
    config,
    locale: translator.locale,
    messages: translator.messages,
  };
}
