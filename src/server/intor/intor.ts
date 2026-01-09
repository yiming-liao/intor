import type { LocaleResolver, ServerSnapshot } from "./types";
import type { IntorRuntimeOptions } from "../runtime";
import type { IntorResolvedConfig } from "@/config";
import {
  getLogger,
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "@/core";
import { createIntorRuntime } from "../runtime/create-intor-runtime";

/**
 * Initializes Intor for the current execution context.
 *
 * Produces a server-side snapshot for SSR and
 * full-stack rendering environments.
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  localeOrResolver: LocaleResolver<CK> | GenLocale<CK>,
  options?: IntorRuntimeOptions,
): Promise<ServerSnapshot<CK>> {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");

  // Create runtime (request-scoped)
  const runtime = createIntorRuntime(config, options);

  // Resolve locale
  const isLocaleFunction = typeof localeOrResolver === "function";
  const locale = isLocaleFunction
    ? await localeOrResolver(config)
    : localeOrResolver || config.defaultLocale;
  const source = typeof localeOrResolver === "function" ? "resolver" : "static";
  logger.debug(`Initial locale resolved as "${locale}" via "${source}".`);

  // Ensure messages & create translator snapshot
  await runtime.ensureMessages(locale);
  const translator = runtime.translator(locale);

  logger.info("Intor initialized.");

  return {
    config,
    locale,
    messages: translator.messages as GenMessages<CK>,
  };
}
