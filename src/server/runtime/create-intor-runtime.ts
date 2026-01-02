import type { IntorRuntime, IntorRuntimeOptions } from "./types";
import type { IntorResolvedConfig } from "@/config";
import type {
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import {
  IntorError,
  IntorErrorCode,
  type GenConfigKeys,
  type GenLocale,
} from "@/core";
import { loadMessages } from "../messages";
import { createTranslator } from "../translator";

/**
 * Create a server-side Intor runtime.
 *
 * - The runtime represents a request-scoped execution context.
 * - It enforces a strict initialization protocol:
 * `ensureMessages(locale) → getTranslator(locale)`
 * - Messages may be empty, but the ensure step must be completed
 * before a translator snapshot can be created.
 */
export function createIntorRuntime<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  options?: IntorRuntimeOptions,
): IntorRuntime<CK> {
  // Locale that has completed the ensureMessages() phase
  let ensuredLocale: GenLocale<CK> | undefined;
  // Messages prepared during ensureMessages(); may be empty
  let ensuredMessages: LocaleMessages | undefined;

  return {
    async ensureMessages(locale: GenLocale<CK>) {
      const messages = await loadMessages({
        config,
        locale,
        readOptions: options?.readOptions,
        allowCacheWrite: options?.allowCacheWrite ?? false,
      });
      ensuredLocale = locale;
      ensuredMessages = messages;
    },

    translator(
      locale: GenLocale<CK>,
      options: {
        preKey?: string;
        handlers?: TranslateHandlers;
        plugins?: (TranslatorPlugin | TranslateHook)[];
      },
    ) {
      // Guard: translator requires ensureMessages() to be completed for this locale
      if (locale !== ensuredLocale) {
        throw new IntorError({
          message: "translator() called before ensureMessages()",
          code: IntorErrorCode.RUNTIME_NOT_INITIALIZED,
        });
      }

      return createTranslator({
        config,
        locale,
        messages: ensuredMessages || {},
        preKey: options?.preKey,
        handlers: options?.handlers,
        plugins: options?.plugins,
      });
    },
  } as IntorRuntime<CK>;
}
